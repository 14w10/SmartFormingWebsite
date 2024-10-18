import { Button, Field } from '@smar/ui';

import st from './styles.module.scss';

export const Form = () => {
  return (
    <div className={st.root}>
      <div className={st.formWrapper}>
        <p className={st.formText}>
          If you have a question or need some assistance, then contact us using the form below.
        </p>
        <form
          action=""
          method="post"
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          <Field type="text" name="name" placeholder="Full name" style={{ marginTop: '16px' }} />
          <Field type="email" name="email" placeholder="Email" style={{ marginTop: '16px' }} />
          <Field
            as="textarea"
            name="message"
            placeholder="Message"
            rows={6}
            style={{ resize: 'none', marginTop: '16px' }}
          />
          <Button type="submit" className={st.button}>
            Send message
          </Button>
        </form>
      </div>
    </div>
  );
};
