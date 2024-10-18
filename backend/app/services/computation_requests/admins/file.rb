# frozen_string_literal: true

require 'csv'

module ComputationRequests
  module Admins
    class File
      def call(computation_request, file_in = true)
        return computation_request&.computation_result&.file_data.to_json unless file_in
       
        meta = computation_request.meta
        schema_meta = computation_request.computation_form.meta

        steps = meta.fetch('steps', [])
        schema = schema_meta.fetch('steps', [])

        my_step = []
        steps.each_with_index do |step, index|
          my_step.push schema[index]["step_title"]
          
          tab = {}
          step.each do |tab_key, tab_value|
            title = schema[index]["properties"][tab_key]["title"]
            tab.merge!({
              "#{title}" => []
            }) unless tab["#{title}"]
            
            case tab_value["type"]
            when "cycle"
              tab_value["values"]["items"].each do |item|
                item.each do |key, field|
                  field.with_indifferent_access
                  tab["#{title}"] << [field['label'], field['value']]
                end
              end                
            when "tab"
              tab_value.fetch('values', {}).each do |key, field|
                field.with_indifferent_access
                tab["#{title}"] << [field['label'], field['value']]
              end
            else
              tab_value.each do |key, field|
                field.with_indifferent_access
                tab["#{title}"] << [field['label'], field['value']]
              end
            end
            my_step.push tab
          end
        end

        my_step.to_json
      end
    end
  end
end

