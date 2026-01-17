import { InjectionToken } from "@angular/core";
import { GetBooksGateway } from "./get-books";

export const GET_BOOKS_GATEWAY = new InjectionToken<GetBooksGateway>("GetBooksGateway");
