# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CoverUploader do
  let(:computation_module){ create :computation_module }
  let(:cover)       { computation_module.cover }
 
  it "extracts mime_type" do
    expect(cover.mime_type).to eq("image/jpeg")
  end
  it "extracts extension" do
    expect(cover.extension).to eq("jpg")
  end
  it "extracts size" do
    expect(cover.size).to be_instance_of(Integer)
  end
  it "extracts width" do
    expect(cover.width).to be_instance_of(Integer)
  end
  it "extracts height" do
    expect(cover.height).to be_instance_of(Integer)
  end
end