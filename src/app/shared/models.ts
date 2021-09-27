//Modelos de candidatos

export class listCandidatesModel{
    id: number;
    identification_candidate: string;
    name_candidate: string;
    role_id: number;
    date_postulation: string;
    wage_aspiration: any;
    phase: number | string;
    email_candidate: string;
    email_evaluator: string;
    role_name: string;
    config?: any;
}

export class newCandidateModel{
    identification_candidate: string;
    name_candidate: string;
    role_id: number;
    date_postulation: string;
    wage_aspiration: number;
    phase: number | string;
    email_candidate: string;
    email_evaluator: string;
}

//Modelos datos etapa 1

export class listPhase1Model{
    id: number;
    id_candidate: number;
    theoretical_qualification: number;
    technical_qualification: number;
    comments: string;
    evaluator_name: string;
}

export class newPhase1Model{
    id_candidate: number;
    theoretical_qualification: number;
    technical_qualification: number;
    comments: string;
    evaluator_name: string;
}


//Modelos datos etapa 2

export class listPhase2Model{
    id: number;
    id_candidate: number;
    psychological_qualification: number;
    medical_qualification: number;
    comments: string;
}

export class newPhase2Model{
    id_candidate: number;
    psychological_qualification: number;
    medical_qualification: number;
    comments: string;
}

//Modelos datos etapa 3

export class listPhase3Model{
    id: number;
    id_candidate: number;
    average: number;
    salary: number | string;
    first_day: string;
}

export class newPhase3Model{
    id_candidate: number;
    average: number;
    salary: number;
    first_day: string;
}


//Modelos lista Roles

export class listRoleModel{
    id: number;
    role_name: string;
}

//Modelo de email

export class emailModel{
    destinatary: string;
    subject: string;
    message: string
}