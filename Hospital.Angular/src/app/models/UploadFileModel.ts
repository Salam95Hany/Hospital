export interface UploadFileModel {
    actionId: number | null;
    actionType: ActionTypes;
    insertUser: string;
    files: FilesModel[];
    deletedFiles: DeletedFileModel[];
}

export interface DeletedFileModel {
    attachmentId: number;
    fileName: string;
}

export enum ActionTypes {
    Patient = 1,
    Admission = 2,
    SurgicalIntervention = 3,
    FollowUp = 4
}

export interface FilesModel {
    attachmentId: number;
    actionType?: ActionTypes;
    fileName: string;
    existFileName: string;
    fileSize: string;
    mediaType: string;
    file: File;
}