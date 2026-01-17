import { InjectionToken } from "@angular/core";
import { CreateBookGateway } from "./create-book";

export const CREATE_BOOK_GATEWAY = new InjectionToken<CreateBookGateway>("CreateBookGateway");
