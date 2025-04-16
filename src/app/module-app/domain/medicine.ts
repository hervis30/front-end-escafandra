import { Generic } from "./generic";

export interface Medicine {
    Id: number;
    Name: string;
    Description: string;
    Stock: number;
    Generics?: Generic[];
}