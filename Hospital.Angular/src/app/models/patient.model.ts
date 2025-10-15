export class Patient {
    name: string = '';
    birthDate: Date | null = null;
    age: number | null = null;
    gender: string = '';
    nationalId: string = '';
    nationalIdImagePath: string = ''; // NEW: For scanned national ID pictures
    address: string = '';
    governorate: string = '';
    occupation: string = '';
    maritalStatus: string = '';
    childrenCount: string = '';
    internalNumber: string = '';
}

export class Admission {
    hospitalFileNumber: string = '';
    admissionDate: Date | null = null;
    dischargeDate: Date | null = null;
    chiefComplaint: string = '';
    duration: string = '';
    course: string = '';
    hpi: string = '';
    currentMedications: string = '';
    pastHistory: string = '';
    familyHistory: string = '';
    comorbidities: string = '';
    bmi: string = '';
    temperature: number | null = null;
    pulse: number | null = null;
    bloodPressure: string = '';
    generalExamination: string = '';
    abdominalExamination: string = '';
    genitalExamination: string = '';
    dreVaginalExamination: string = '';
    
    // NEW: Lab Investigations
    urineAnalysis: string = '';
    cultureAndSensitivity: string = '';
    serumCreatinine: number | null = null;
    hemoglobin: number | null = null;
    totalLeukocyteCount: number | null = null;
    platelets: number | null = null;
    ptPttInr: string = '';
    liverEnzymes: string = '';
    
    // NEW: Blood Sugar sub-values
    fastingBloodSugar: number | null = null;
    postPrandialBloodSugar: number | null = null;
    hbA1c: number | null = null;
    
    // NEW: PSA sub-values
    psaTotal: number | null = null;
    psaFree: number | null = null;
    psaRatio: number | null = null;
    
    otherLabResults: string = '';
    
    // NEW: Imaging Investigations
    put: string = '';
    ultrasound: string = '';
    trus: string = '';
    ct: string = '';
    mri: string = '';
    isotopeStudies: string = '';
    otherImaging: string = '';
    
    provisionalDiagnosis: string = '';
    medicalDecision: string = '';
    scheduledDate: Date | null = null;
}

export class SurgicalIntervention {
    interventionDate: Date | null = null;
    theater: string = '';
    mainSurgeon: string = '';
    assistants: string = '';
    resident: string = '';
    
    // NEW: Missing properties
    otherSurgeons: string = '';
    offFieldSupervisor: string = '';
    
    anesthesia: string = '';
    intervention: string = '';
    interventionDetails: string = '';
    tubesFixed: string = '';
    category: string = '';
    approach: string = '';
    organ: string = '';
    intraOperativeCourse: string = '';
    intraOpAdverseEvents: string = '';
    bloodTransfusionUnits: number | null = null;
    postOpRecommendations: string = '';
    postOpDay0_1: string = '';
    postOpDay2_5: string = '';
    postOpDayOver5: string = '';
    postOpAdverseEvents: string = '';
    dischargeDate: Date | null = null;
    finalDiagnosis: string = '';
    dischargeInstructions: string = '';
    followUpDoctor: string = '';
    followUpDoctorPhone: string = '';
    followUpAppointment: Date | null = null;
}

export class FollowUp {
    followUpDate: Date | null = null;
    
    // NEW: Structured patient remarks
    patientRemarksStatus: string = ''; // Better, Worse, The same
    patientRemarksDetails: string = '';
    
    examinationFindings: string = '';
    woundStatus: string = '';
    catheters: string = '';
    labResults: string = '';
    imagingResults: string = '';
    imagePath: string = '';
    advice: string = '';
    newDecision: string = '';
    nextFollowUpDate: Date | null = null;
}

export class PatientData {
    patient: Patient = new Patient();
    admission: Admission = new Admission();
    surgicalIntervention: SurgicalIntervention = new SurgicalIntervention();
    followUp: FollowUp = new FollowUp();
}