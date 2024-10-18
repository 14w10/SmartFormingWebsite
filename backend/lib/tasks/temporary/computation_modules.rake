# frozen_string_literal: true

namespace :computation_modules do
  desc 'Create and set default category for computation modules'
  task create_and_set_default_category: :environment do
    computation_modules = ComputationModule.where(category: nil)
    puts "Going to update #{computation_modules.count} computation modules"

    ActiveRecord::Base.transaction do
      category = Category.first_or_create(name: 'Other')

      computation_modules.each do |computation_module|
        computation_module.update!(category: category)

        print '.'
      end
    end

    print 'Completed'
  end

  desc 'Migrate modules form another DB'
  task migrate: :environment do
    pool = PG.connect(
      'host' => ENV.fetch('IMPORT_DB_HOST', 'db'),
      'port' => 5432,
      'user' => ENV.fetch('IMPORT_DB_USER', 'postgres'),
      'password' => ENV.fetch('IMPORT_DB_PASSWORD', 'pwd'),
      'dbname' => ENV.fetch('IMPORT_DB_DATABASE', '')
    )

    computation_modules_data = pool.exec('select * from computation_modules')

    computation_modules_data.each do |entry|
      ActiveRecord::Base.transaction(requires_new: true) do
        computation_module_id = entry.delete('id')

        next if ComputationModule.find_by(title: entry['title'])

        entry['cover_data'] = ActiveSupport::JSON.decode(entry['cover_data']) if entry['cover_data']
        entry['keywords'] = ActiveSupport::JSON.decode(entry['keywords']) if entry['cover_data']
        entry['meta'] = ActiveSupport::JSON.decode(entry['meta']) if entry['cover_data']
        entry['module_type'] = ComputationModule.module_types[entry['module_type']]
        entry['module_content_type'] = ComputationModule.module_content_types[entry['module_content_type']]
        entry['category_id'] = Category.first.id


        computation_module = ComputationModule.new(entry)

        puts '-' * 100

        puts "Fetching #{computation_module.title} data."
        puts "Received computation module id: #{computation_module_id} data."

        authors_data = pool.exec('select email from users WHERE id = %i LIMIT 1' % computation_module.author_id)

        puts "Fetching #{computation_module.title} author data."

        author = User.find_by(email: authors_data.values.flatten)

        if author.present?
          puts "Assign author #{author.email}."
          computation_module.author = author

        else

          puts 'Initialize system author.'
          user = User.find_or_initialize_by(email: 'system@author.io') do |u|
            u.role = :editor
            u.first_name = 'System'
            u.last_name = 'Author'
            u.password =  '12345678'
            u.password_confirmation = '12345678'
          end

          computation_module.author = user
        end

        puts 'Fetching attachments data.'
        attachments_data = pool.exec("select * from attachments WHERE attachable_id = %i AND attachable_type = 'ComputationModule'" % computation_module_id)

        attachments_data.each do |attachment_data|
          attachment_data.delete('attachable_id')
          attachment_data.delete('attachable_type')
          attachment_data.delete('id')

          attachment_data['file_data'] = ActiveSupport::JSON.decode(attachment_data['file_data']) if attachment_data['file_data']
          attachment_data['file_type'] = Attachment.file_types.key(attachment_data['file_type'].to_i)

          attachment = Attachment.new(attachment_data)

          puts "Pushing #{attachment.label} attachment."

          computation_module.attachments.push(attachment)
        end

        computation_module.save!
        author.save!
      end
    end
    puts '-' * 100
  end
end
