import { FormField, Input, Select } from '@smar/ui';

const titleOptions = [
  { label: 'Mr', value: 'mr' },
  { label: 'Miss', value: 'miss' },
  { label: 'Doctor', value: 'doctor' },
  { label: 'Professor', value: 'professor' },
];

export const FirstStep = () => {
  return (
    <>
      <FormField
        component={Select}
        className="mb-2"
        // type="text"
        name="title"
        label="Title *"
        items={titleOptions}
        controlled
      />
      <FormField
        component={Input}
        className="mb-2"
        type="text"
        name="firstName"
        label="First name *"
      />
      <FormField
        component={Input}
        className="mb-2"
        type="text"
        name="lastName"
        label="Last name *"
      />
      <FormField component={Input} className="mb-2" type="tel" name="phoneNumber" label="Phone *" />
      <FormField component={Input} className="mb-2" type="email" name="email" label="Email *" />
      <FormField
        component={Input}
        className="mb-2"
        type="password"
        name="password"
        label="Password *"
      />
      <FormField
        component={Input}
        className="mb-2"
        type="password"
        name="passwordConfirmation"
        label="Confirm password *"
      />
    </>
  );
};
