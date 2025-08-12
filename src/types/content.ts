export interface Item {
    no: number;
    title: string;
    body: string;
}

export interface Section {
    id: string;
    title: string;
    body:string
    images?: string;
    intro?: string;
    items?: Item[];
    summary?: string;
}

export interface ContentDoc {
    language: string;
    version: string;
    sections: Section[];
}
