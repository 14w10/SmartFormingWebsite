# frozen_string_literal: true

require 'json'

def handle_cops(linter, warnings_count, command)
  return unless warnings_count.positive?

  puts "#{linter} found #{warnings_count} warnings."
  puts "For details run: '#{command}'"
  exit(1)
end

desc 'Lint all'
task lint: :environment do
  %i[bundle rubocop missing_locales unused_locales rspec].each do |linter|
    Rake::Task["lint:#{linter}"].execute
  end
end


namespace :lint do
  desc 'Lint *.rb files'
  task rubocop: :environment do
    output = `bin/rubocop --format json`
    warnings_actual = JSON.parse(output)['summary']['offense_count']
    handle_cops(:rubocop, warnings_actual, 'bin/rubocop')
  end

  desc 'Lint config/locales/*.yml files'
  task missing_locales: :environment do
    output = `bin/i18n-tasks missing --format json`
    warnings_actual = JSON.parse(output).keys.count
    handle_cops(:missing_locales, warnings_actual, 'bin/i18n-tasks missing')
  end

  desc 'Lint config/locales/*.yml files'
  task unused_locales: :environment do
    output = `bin/i18n-tasks unused --format json`
    warnings_actual = JSON.parse(output).keys.count
    handle_cops(:unused_locales, warnings_actual, 'bin/i18n-tasks unused')
  end

  desc 'Lint rspec errors'
  task rspec: :environment do
    output = `bin/rspec --format json`
    warnings_actual = JSON.parse(output)['summary']['failure_count']
    handle_cops(:rspec, warnings_actual, 'bin/rspec')
  end

  desc 'Lint gems vulnerabilities'
  task bundle: :environment do
    output = `bin/bundle-audit check`
    warnings_actual = output.shellescape.split("'\n''\n'").count - 1
    handle_cops(:bundler, warnings_actual, 'bin/bundle-audit')
  end
end