import * as Yup from 'yup';

export const createPostSchema = Yup.object({
  title: Yup.string()
    .required('Title is required'),
  
  rate: Yup.number()
    .required('Rate is required')
    .min(1, 'Rate must be at least 1')
    .max(10, 'Rate cannot be more than 10'),
  
  status: Yup.string()
    .required('Status is required'),

  genres: Yup.array()
    .of(Yup.number())
    .optional(), // Optional field
  
  mediums: Yup.array()
    .of(Yup.number())
    .optional(), // Optional field
  
  synopsis: Yup.string()
    .optional(),

  review: Yup.string()
    .required('Review is required')
});
