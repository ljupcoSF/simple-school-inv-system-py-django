export type Role = "admin" | "student";

export interface UserMe {
  id: number;
  username: string;
  email: string;
  role: Role;
  first_name?: string;
  last_name?: string;
}

export interface Equipment {
  id: number;
  name: string;
  description: string;
  status: "available" | "borrowed";
}

export type BorrowStatus = "pending" | "approved" | "declined" | "returned";

export interface BorrowRequest {
  id: number;
  user: string;               // username
  equipment: number;          // equipment id
  equipment_name: string;     // display name
  status: BorrowStatus;
  request_date: string;
  return_date?: string | null;
}
