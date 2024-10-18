# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::Store::ComputationRequestsController do
  let(:user) { create(:user) }

  before { sign_in user }

  describe 'POST #create' do
    let!(:author) { create(:user) }
    let!(:computation_form) { create(:computation_form, meta: meta) }
    let(:meta) do
      {
        files: [
          {
            label: 'Test 1',
            field_name: 'a1572354077067',
            description: ''
          },
          {
            label: 'Test 2',
            field_name: 'a1572354081718',
            description: ''
          }
        ],
        steps:[{id:"Qq5RAc_3JYlQKtU6tskkb", type:"object", title:"sdg", schema:"http://json-schema.org/draft-07/schema#", required:["a1609234370829"], properties:{"a1609234370829":{type:"array", items:{type:"object", properties:{a1609234381526:{type:"integer", label:"weg", default:1, max_length:22, min_length:1, step_value:"1", description:"weg"}}}, title:"tez", description:"weg"}}, step_title:"sdgsdg", description:"sdg"}]
      }
    end
    let(:computation_request_params) do
      {
        author_id: author.id,
        computation_form_id: computation_form.id,
        steps:[{a1609234370829:{a1609234381526:{type:"integer", label:"weg", value:5, default:1, max_length:22, min_length:1, step_value:"1", description:"weg"}}}],
        attachment_attributes: attachment
      }
    end
    
    
    let(:params) do
      {
        computation_request: computation_request_params
      }
    end
    
    context "with attachment attributes" do
      let(:attachment) do
        {
          file: {
            id: '49f543380aa2086b89148af105f9d214',
            storage: 'cache',
            metadata: {
              size: 559,
              filename: 'test.zip',
              mime_type: 'application/zip'
            }
          },
          file_type: 'computationRequestData',
          description: '',
          label: 'Test 1',
          field_name: 'a1572354077067'
        }        
      end
      before do
        allow(controller).to receive(:steps_validation_success?).and_return(true)
        stub_request(:post, "http://pythonsend:5000").
          #with(body: /world$/, headers: {"Content-Type" => /image\/.+/}).
          to_return(body: { data: {test:"test"}, message: 'OK' }.to_json, status: 200)

        
        post :create, params: params
      end
  
      it 'creates computation_module' do
        expect(author.computation_requests.any?).to be
      end
  
      it 'matches schema' do
        expect(response.status).to eq 201
        expect(json['data']['attributes']).to match_schema 'computation_request'
      end

      it 'has attachment' do
        cr = ComputationRequest.find(json['data']['attributes']['id'])
        expect(cr.attachment).to be
      end
    end

    context "without attachment attributes" do
      let(:attachment) do
        {}        
      end
      before do
        allow(controller).to receive(:steps_validation_success?).and_return(true)
        stub_request(:post, "http://pythonsend:5000").
          #with(body: /world$/, headers: {"Content-Type" => /image\/.+/}).
          to_return(body: { data: {test:"test"}, message: 'OK' }.to_json, status: 200)
        post :create, params: params
      end
  
      it 'creates computation_module' do
        expect(author.computation_requests.any?).to be
      end
  
      it 'matches schema' do
        expect(response.status).to eq 201
        expect(json['data']['attributes']).to match_schema 'computation_request'
      end
    end

  end

  describe 'GET #show' do
    let!(:computation_request) { create(:computation_request, author: user) }

    before { get :show, params: { id: computation_request.id } }

    it 'matches schema' do
      expect(response.status).to eq 200
      expect(json['data']['attributes']).to match_schema 'computation_request'
      expect(json['data']['id'].to_i).to eq(computation_request.id)
    end
  end
end
