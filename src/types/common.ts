import { JSX } from "react";

export enum DataFetchStatus {
  Initial = 'initial',
  InProgress = 'in_progress',
  Success = 'success',
  Error = 'error',
}

export enum Gender {
  Male = 'male',
  Female = 'female',
}

export type Country = {
  value: string;
  label: string;
};

export interface BaseApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type ActionIconData = {
  icon: () => JSX.Element;
  onClick: () => void;
  isDisabled?: boolean;
}
