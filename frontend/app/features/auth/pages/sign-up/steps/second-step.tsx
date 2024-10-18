import { FormField, Input } from '@smar/ui';

export const SecondStep = () => {
  return (
    <>
      <FormField
        component={Input}
        className="mb-2"
        type="text"
        name="organizationName"
        label="Organization Name  *"
      />
      <FormField
        component={Input}
        className="mb-2"
        type="text"
        name="organizationAddress"
        label="Organization Address *"
      />
      <FormField
        component={Input}
        className="mb-2"
        type="text"
        name="organizationPostcode"
        label="Organization Post Code *"
      />
      <FormField
        component={Input}
        className="mb-2"
        type="text"
        name="organizationCountry"
        label="Organization Country *"
      />
      <FormField
        component={Input}
        className="mb-2"
        type="text"
        name="position"
        label="User's position"
      />
      <FormField
        component={Input}
        className="mb-2"
        type="text"
        name="role"
        label="User's major role in the organization"
      />
      <FormField
        component={Input}
        className="mb-2"
        type="text"
        name="linkedin"
        label="LinkedIn profile link"
      />
      <FormField
        component={Input}
        className="mb-2"
        type="text"
        name="website"
        label="Personal/Academic Website"
      />
      <FormField
        component={Input}
        className="mb-2"
        type="text"
        name="researchGate"
        label="ResearchGate link"
      />
      <FormField
        component={Input}
        className="mb-2"
        type="text"
        name="otherLink"
        label="Other public link"
      />
    </>
  );
};
