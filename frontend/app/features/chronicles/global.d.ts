enum AttrType {
    TITLE, PHOTO, TEXT
}

interface Attr {
    id: number;
    name: string; 
    value: string | null;
    type: AttrType; 
    attachments: IAttachFile[]; 
    createdAt: string; 
}

interface Subject {
    id: number;
    createdAt: string; 
    color: string; 
    name: string;
}

interface Template {
    id: number;
    name: string; 
    attrs: Attr[];
    subject: Subject;
    createdAt: string; 
}
