import css from "./NoteForm.module.css";
// import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";

import type { NewNote } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import { useId } from "react";
import { createNote } from "@/lib/api";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";

interface NoteFormProps {
  onClose: () => void;
}
const formValues: NewNote = {
  title: "",
  content: "",
  tag: "Todo",
};

const NotesSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Too short!")
    .max(50, "Too long!")
    .required("Required field"),
  content: Yup.string().max(500, "Too long!"),
  tag: Yup.string()
    .oneOf(["Work", "Personal", "Meeting", "Shopping", "Todo"])
    .required("Required field"),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newNote: NewNote) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  const fieldId = useId();

  const handleSubmit = (
    values: NewNote,
    formikHelpers: FormikHelpers<NewNote>
  ) => {
    mutation.mutate(values, {
      onSuccess: () => {
        formikHelpers.resetForm();
        formikHelpers.setSubmitting(false);
        setTimeout(onClose, 300);
      },
    });
  };

  return (
    <Formik
      initialValues={formValues}
      onSubmit={handleSubmit}
      validationSchema={NotesSchema}
    >
      {({ isSubmitting }) => {
        return (
          <Form className={css.form}>
            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-title`}>Title</label>
              <Field
                id={`${fieldId}-title`}
                type="text"
                name="title"
                className={css.input}
              />
              <ErrorMessage
                name="title"
                component="span"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-content`}>Content</label>
              <Field
                as="textarea"
                id={`${fieldId}-content`}
                name="content"
                rows={8}
                className={css.textarea}
              />
              <ErrorMessage
                name="content"
                component="span"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-tag`}>Tag</label>
              <Field
                as="select"
                id={`${fieldId}-tag`}
                name="tag"
                className={css.select}
              >
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
              </Field>
              <ErrorMessage name="tag" component="span" className={css.error} />
            </div>

            <div className={css.actions}>
              <button
                onClick={onClose}
                type="button"
                className={css.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={css.submitButton}
                disabled={false}
              >
                {isSubmitting ? "Creating..." : "Create Note"}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
