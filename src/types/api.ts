export type RegistrationReqeust = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  reviewedBy: number;
  createdAt: Date;
};

export type NewUser = {
  firstName: string;
  lastName: string;
  email: string;
};
