# frozen_string_literal: true

class ComputationRequestResultSerializer < ApplicationSerializer
  set_type :computation_request
  
  attributes :id

  attribute :axes do |record|
  end


  attribute :results do |record|
    csv = ::CSV.read('SetUpAintComplete_D-20_25_Sheet_ElementData.csv', headers: true)
    h = Hash[csv.headers.compact.collect {|v| [v, []]}]
    csv.map do |c| 
      c.each do |k,v|
        next unless h.has_key?(k)
        h[k] << v
      end
    end
    
    h.transform_keys{ |key| key.parameterize(separator: '_').camelize(:lower) }
  end
end
