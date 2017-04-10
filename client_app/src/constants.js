/**
 * Created by saharmehrpour on 4/9/17.
 */
var Constants = (function () {
    function Constants() {
    }
    return Constants;
}());
export { Constants };
Constants.cols = {
    "Demo": { "SuperWide": [], "Wide": [5, 7, 16, 17, 19, 20, 21], "Medium": [0, 1, 2, 8, 10, 14, 15] },
    "PRO": { "SuperWide": [], "Wide": [3, 5], "Medium": [0, 1, 2, 6] },
    "PT": { "SuperWide": [], "Wide": [2, 4], "Medium": [0, 1, 3] },
    "VAS": { "SuperWide": [], "Wide": [], "Medium": [0, 1, 2, 3] },
    "Codes": { "SuperWide": [], "Wide": [], "Medium": [0, 1, 2] },
    "CCI": { "SuperWide": [], "Wide": [], "Medium": [0, 1] },
    "Orders": { "SuperWide": [6], "Wide": [2, 5], "Medium": [0, 1, 3, 4] }
};
Constants.header = {
    "Demo": ["PAT_ID", "VISIT_NO", "PAT_BIRTHDATE", "PAT_GENDER", "PAT_ETHNICITY",
        "D_ETHNICITY_DESC", "PAT_RACE", "D_RACE_DESC", "PAT_ZIP", "PAT_MARITAL_STAT",
        "PAT_DEATH_DATE", "PAT_DEATH_IND", "BMI", "HEIGHT_CM", "WEIGHT_KG", "VISIT_NO_1",
        "ADM_DATE", "DSCH_DATE", "ATT_PROV_ID", "ATT_PROV_FULLNAME", "INS_PAY_CAT",
        "INS_PAY_GRP", "TOBACCO_USER", "ALCOHOL_USER", "ILLICIT_DRUG_USER"],
    "PRO": ["PAT_ID", "VISIT_NO", "ASSESSMENT_ID", "ASSESSMENT_START_DTM", "FORM_ID",
        "FORM", "SCORE"],
    "PT": ["PAT_ID", "VISIT_NO", "ADM_DATE", "PAT_UNIT", "UNIT_NAME"],
    "VAS": ["PAT_ID", "VISIT_NO", "FSD_ID", "RECORDED_TIME", "VAS_NECK", "VAS_ARM"],
    "Codes": ["PAT_ID", "VISIT_NO", "PROC_DTM", "DM_CODE", "INJ_CODE", "SURGERY_CODE",
        "ICD_1", "ICD_2", "ICD_3", "ICD_4", "ICD_5", "ICD_6", "ICD_7", "ICD_8", "ICD_9",
        "ICD_10", "CPT_1", "CPT_2", "CPT_3", "CPT_4", "CPT_5", "CPT_6", "CPT_7", "CPT_8",
        "CPT_9", "CPT_10",],
    "CCI": ["PAT_ID", "VISIT_NO", "CCI_MI", "CCI_CHF", "CCI_PVD", "CCI_CVD", "CCI_DEMENTIA",
        "CCI_COPD", "CCI_RHEUM_DZ", "CCI_PUD", "CCI_DM_WO_COMPL", "CCI_DM_W_COMPL",
        "CCI_PARAPLEGIA", "CCI_RENAL_DZ", "CCI_MALIGNANT_TUMOR", "CCI_LYMPHOMA", "CCI_LEUKEMIA",
        "CCI_LIVER_MILD_DZ", "CCI_LIVER_SEVERE_DZ", "CCI_METAST_TUMOR", "CCI_HIV_AIDS",
        "CCI_SCORE"],
    "Orders": ["PAT_ID", "VISIT_NO", "ORDER_DTM", "ORDER_STATUS", "ORDER_CATALOG_TYPE",
        "PRIMARY_MNEMONIC", "ORDER_MNEMONIC"]
};
//# sourceMappingURL=constants.js.map