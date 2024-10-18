class ComputationModuleDecorator < SimpleDelegator
  def self.wrap(collection)
    collection.map do |obj|
        new obj
    end
  end

  def ihtc?
    title.downcase.start_with?('ihtc')
  end

  def toolmaker?
    title.downcase.start_with?('toolmaker')
  end

  def formability?
    title.downcase.start_with?('formability')
  end

  def tailor?
    title.downcase.start_with?('tailor')
  end

  def material_mate?
    title.downcase.start_with?('material')
  end

  def temperature_changing?
    title.downcase.start_with?('temperature')
  end

  def pressure_changing?
    title.downcase.start_with?('contact pressure')
  end

  def speed_changing?
    title.downcase.start_with?('sliding speed')
  end

  def multi_curve?
    title.downcase.start_with?('multi')
  end

  def stress?
    title.downcase.start_with?('stress')
  end    

  def lubricant_limit?
    title.downcase.include?('lubricant limit diagram')
  end    

  def card_schuler?
    title.downcase.start_with?('card')
  end    

  def friction_schuler?
    title.downcase.start_with?('friction')
  end    

  def mpt2223?
    title.downcase.start_with?('mpt2223')
  end

  def mpt2324?
    title.downcase.start_with?('mpt2324')
  end

  def matcardhr?
    title.downcase.start_with?('heating rate')
  end

  def module_type
    return 'toolmaker'      if toolmaker?
    return 'formability'    if formability?
    return 'tailor'         if tailor?
    return 'material_mate'  if material_mate?
    return 'multi_curve'      if multi_curve?            
    return 'speed_changing'      if speed_changing?            
    return 'pressure_changing'      if pressure_changing?
    return 'temperature_changing'    if temperature_changing?
    return 'stress'    if stress?
    return 'lubricant_limit'    if lubricant_limit?
    return 'card_schuler'    if card_schuler?
    return 'friction_schuler'    if friction_schuler?
    return 'mpt2223'    if mpt2223?
    return 'mpt2324'  if mpt2324?
    return 'matcardhr'   if matcardhr?
    return 'ihtc'
  end
end
