class PortfolioComputationModulePresenter
  def initialize(portfolio_module)
    @portfolio_module = portfolio_module
  end
  
  def prepared_data
    out = {}
    @portfolio_module.portfolio_computation_modules.each do |pc_module|
      out.merge!(Hash[pc_module.computation_module.module_type, []]) unless out.key?(pc_module.computation_module.module_type)
      out[pc_module.computation_module.module_type].insert(pc_module.sort_index, pc_module.computation_module_id) 
    end
    out.each {|k,v| v.compact!}
  end
end