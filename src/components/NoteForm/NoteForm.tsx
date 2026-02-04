import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onCancel: () => void;
  onSubmit: (values: {
    title: string;
    content: string;
    tag: string;
  }) => void;
  isSubmitting: boolean;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: string;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3)
    .max(50)
    .required('Required'),
  content: Yup.string()
    .max(500),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Required'),
});
export default function NoteForm({ onCancel,onSubmit,
  isSubmitting, }: NoteFormProps) {
  const initialValues: NoteFormValues = {
    title: '',
    content: '',
    tag: 'Todo',
  };
    return( <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values,actions) => {
    onSubmit(values);
    actions.resetForm();
      }}
    >
      {() => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" className={css.input} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>

            <button type="submit" className={css.submitButton} disabled={isSubmitting}>
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}