import { InjectionToken } from "@angular/core";
import { DeleteBookGateway } from "./delete-book";

export const DELETE_BOOK_GATEWAY = new InjectionToken<DeleteBookGateway>("DeleteBookGateway");
