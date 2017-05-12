/**
 * Created by saharmehrpour on 4/9/17.
 */

export class Constants {
  static cols = {
    'Demo': {'SuperWide': [], 'Wide': [5, 7, 15, 16, 18, 19, 20], 'Medium': [0, 1, 2, 8, 10, 14]},
    'PRO': {'SuperWide': [], 'Wide': [3, 5], 'Medium': [0, 1, 2, 6]},
    'PT': {'SuperWide': [], 'Wide': [2, 4], 'Medium': [0, 1, 3]},
    'VAS': {'SuperWide': [], 'Wide': [], 'Medium': [0, 1, 2, 3]},
    'Codes': {'SuperWide': [], 'Wide': [], 'Medium': [0, 1, 2]},
    'CCI': {'SuperWide': [], 'Wide': [], 'Medium': [0, 1]},
    'Orders': {'SuperWide': [5, 6], 'Wide': [2], 'Medium': [0, 1, 3, 4]}
  };

  static header = {
    'Demo': ['PAT_ID', 'VISIT_NO', 'PAT_BIRTHDATE', 'PAT_GENDER', 'PAT_ETHNICITY',
      'D_ETHNICITY_DESC', 'PAT_RACE', 'D_RACE_DESC', 'PAT_ZIP', 'PAT_MARITAL_STAT',
      'PAT_DEATH_DATE', 'PAT_DEATH_IND', 'BMI', 'HEIGHT_CM', 'WEIGHT_KG', //'VISIT_NO_1',
      'ADM_DATE', 'DSCH_DATE', 'ATT_PROV_ID', 'ATT_PROV_FULLNAME', 'INS_PAY_CAT',
      'INS_PAY_GRP', 'TOBACCO_USER', 'ALCOHOL_USER', 'ILLICIT_DRUG_USER'],
    'PRO': ['PAT_ID', 'VISIT_NO', 'ASSESSMENT_ID', 'ASSESSMENT_START_DTM', 'FORM_ID',
      'FORM', 'SCORE'],
    'PT': ['PAT_ID', 'VISIT_NO', 'ADM_DATE', 'PAT_UNIT', 'UNIT_NAME'],
    'VAS': ['PAT_ID', 'VISIT_NO', 'FSD_ID', 'RECORDED_TIME', 'VAS_NECK', 'VAS_ARM'],
    'Codes': ['PAT_ID', 'VISIT_NO', 'PROC_DTM', 'DM_CODE', 'INJ_CODE', 'SURGERY_CODE',
      //'ICD_1', 'ICD_2', 'ICD_3', 'ICD_4', 'ICD_5', 'ICD_6', 'ICD_7', 'ICD_8', 'ICD_9', 'ICD_10',
      'CPT_1', 'CPT_2', 'CPT_3', 'CPT_4', 'CPT_5', 'CPT_6', 'CPT_7', 'CPT_8',
      'CPT_9', 'CPT_10',],
    'CCI': ['PAT_ID', 'VISIT_NO', 'CCI_MI', 'CCI_CHF', 'CCI_PVD', 'CCI_CVD', 'CCI_DEMENTIA',
      'CCI_COPD', 'CCI_RHEUM_DZ', 'CCI_PUD', 'CCI_DM_WO_COMPL', 'CCI_DM_W_COMPL',
      'CCI_PARAPLEGIA', 'CCI_RENAL_DZ', 'CCI_MALIGNANT_TUMOR', 'CCI_LYMPHOMA', 'CCI_LEUKEMIA',
      'CCI_LIVER_MILD_DZ', 'CCI_LIVER_SEVERE_DZ', 'CCI_METAST_TUMOR', 'CCI_HIV_AIDS',
      'CCI_SCORE'],
    'Orders': ['PAT_ID', 'VISIT_NO', 'ORDER_DTM', 'ORDER_STATUS', 'ORDER_CATALOG_TYPE',
      'PRIMARY_MNEMONIC', 'ORDER_MNEMONIC']
  };

  static scoreIds = {
    'PROMIS Bank v1.2 - Physical Function' : 'promis_physical',
    'PROMIS Bank v1.0 - Depression' : 'promis_depression',
    'Oswestry Index (ODI)': 'owestry',
    'PROMIS SF v1.2 - Physical Function 8b': 'promis_physical_8',
    'PROMIS Bank v1.2 - Physical Function (Expectations)': 'promis_physical_exp',
    'ODI (Bisson)': 'bisson',
    'PROMIS-Ca Bank v1.1 - Physical Function': 'promis_ca',
    'ODI for Lumbar Spine (Owestry Disability Index) Neurosurgery': 'lumar'
  };

  static sideBar = { // Match with partial header in update_weights
    'Demo': {
      'PAT_BIRTHDATE': 'Birth Date', 'PAT_GENDER': 'Gender',
      'PAT_ETHNICITY': 'Ethnicity', 'PAT_RACE': 'Race', 'PAT_MARITAL_STAT': 'Marital Status',
      'BMI': 'BMI', 'HEIGHT_CM': 'Height', 'WEIGHT_KG': 'Weight',
      'TOBACCO_USER': 'Tobacco User', 'ALCOHOL_USER': 'Alcohol user',
      'ILLICIT_DRUG_USER': 'Illicit Drug User'
    },
    'CCI': {'CCI_SCORE': 'CCI score'}
  };

  static histogramLabels = {
    'GENDER': ['Female', 'Male'],
    'BMI': ['Unknown BMI', 'BMI≤18', '18<BMI≤21', '21<BMI≤24', '24<BMI≤27', '27<BMI≤30', '30<BMI'],
    'AGE': ['AGE≤10', '10<AGE≤20', '20<AGE≤30', '30<AGE≤40', '40<AGE≤50', '50<AGE≤60', '60<AGE≤70',
      '70<AGE≤80', '80<AGE≤90', '90<AGE≤100', '100<AGE']
  };


  static patientPRO = {
    PRO: [
      {
        "INDEX": 14957,
        "PAT_ID": 5330196,
        "VISIT_NO": 196344679,
        "ASSESSMENT_ID": 1215,
        "ASSESSMENT_START_DTM": "1/7/2014 9:19:54 AM",
        "FORM_ID": 3,
        "FORM": "Oswestry Index (ODI)",
        "SCORE": 24
      },
      {
        "INDEX": 14958,
        "PAT_ID": 5330196,
        "VISIT_NO": 196344679,
        "ASSESSMENT_ID": 1215,
        "ASSESSMENT_START_DTM": "1/7/2014 9:19:54 AM",
        "FORM_ID": 1123,
        "FORM": "PROMIS Bank v1.2 - Physical Function",
        "SCORE": 35.3960571289
      },
      {
        "INDEX": 15080,
        "PAT_ID": 5330196,
        "VISIT_NO": 196519219,
        "ASSESSMENT_ID": 1573,
        "ASSESSMENT_START_DTM": "1/15/2014 11:45:11 AM",
        "FORM_ID": 3,
        "FORM": "Oswestry Index (ODI)",
        "SCORE": 24
      },
      {
        "INDEX": 15081,
        "PAT_ID": 5330196,
        "VISIT_NO": 196519219,
        "ASSESSMENT_ID": 1573,
        "ASSESSMENT_START_DTM": "1/15/2014 11:45:11 AM",
        "FORM_ID": 1123,
        "FORM": "PROMIS Bank v1.2 - Physical Function",
        "SCORE": 36.3121185303
      },
      {
        "INDEX": 2494,
        "PAT_ID": 5330196,
        "VISIT_NO": 196519169,
        "ASSESSMENT_ID": 4384,
        "ASSESSMENT_START_DTM": "2/25/2014 11:27:13 AM",
        "FORM_ID": 3,
        "FORM": "Oswestry Index (ODI)",
        "SCORE": 60
      },
      {
        "INDEX": 2545,
        "PAT_ID": 5330196,
        "VISIT_NO": 196519169,
        "ASSESSMENT_ID": 4384,
        "ASSESSMENT_START_DTM": "2/25/2014 11:27:13 AM",
        "FORM_ID": 1123,
        "FORM": "PROMIS Bank v1.2 - Physical Function",
        "SCORE": 24.0662689209
      },
      {
        "INDEX": 8369,
        "PAT_ID": 5330196,
        "VISIT_NO": 197196558,
        "ASSESSMENT_ID": 9358,
        "ASSESSMENT_START_DTM": "4/8/2014 1:42:35 PM",
        "FORM_ID": 3,
        "FORM": "Oswestry Index (ODI)",
        "SCORE": 38
      },
      {
        "INDEX": 8370,
        "PAT_ID": 5330196,
        "VISIT_NO": 197196558,
        "ASSESSMENT_ID": 9358,
        "ASSESSMENT_START_DTM": "4/8/2014 1:42:35 PM",
        "FORM_ID": 1123,
        "FORM": "PROMIS Bank v1.2 - Physical Function",
        "SCORE": 36.5253143311
      },
      {
        "INDEX": 10841,
        "PAT_ID": 5330196,
        "VISIT_NO": 197889095,
        "ASSESSMENT_ID": 10785,
        "ASSESSMENT_START_DTM": "4/17/2014 3:33:17 PM",
        "FORM_ID": 1110,
        "FORM": "PROMIS Bank v1.0 - Depression",
        "SCORE": 51.7005386353
      },
      {
        "INDEX": 10842,
        "PAT_ID": 5330196,
        "VISIT_NO": 197889095,
        "ASSESSMENT_ID": 10785,
        "ASSESSMENT_START_DTM": "4/17/2014 3:33:17 PM",
        "FORM_ID": 1123,
        "FORM": "PROMIS Bank v1.2 - Physical Function",
        "SCORE": 51.2514610291
      },
      {
        "INDEX": 9441,
        "PAT_ID": 5330196,
        "VISIT_NO": 202937600,
        "ASSESSMENT_ID": 62577,
        "ASSESSMENT_START_DTM": "2/5/2015 8:51:27 AM",
        "FORM_ID": 1123,
        "FORM": "PROMIS Bank v1.2 - Physical Function",
        "SCORE": 45.8695573774
      },
      {
        "INDEX": 21258,
        "PAT_ID": 5330196,
        "VISIT_NO": 205870856,
        "ASSESSMENT_ID": 83264,
        "ASSESSMENT_START_DTM": "6/18/2015 1:41:50 PM",
        "FORM_ID": 1123,
        "FORM": "PROMIS Bank v1.2 - Physical Function",
        "SCORE": 40.8569573531
      },
      {
        "INDEX": 21674,
        "PAT_ID": 5330196,
        "VISIT_NO": 208131018,
        "ASSESSMENT_ID": 107605,
        "ASSESSMENT_START_DTM": "10/29/2015 1:45:52 PM",
        "FORM_ID": 1123,
        "FORM": "PROMIS Bank v1.2 - Physical Function",
        "SCORE": 40.1044
      },
      {
        "INDEX": 35948,
        "PAT_ID": 5330196,
        "VISIT_NO": 215830943,
        "ASSESSMENT_ID": 394144,
        "ASSESSMENT_START_DTM": "12/1/2016 2:39:24 PM",
        "FORM_ID": 1123,
        "FORM": "PROMIS Bank v1.2 - Physical Function",
        "SCORE": 37.90983
      },
      {
        "INDEX": 21569,
        "PAT_ID": 5330196,
        "VISIT_NO": 209912991,
        "ASSESSMENT_ID": 127675,
        "ASSESSMENT_START_DTM": "1/21/2016 9:45:24 AM",
        "FORM_ID": 1123,
        "FORM": "PROMIS Bank v1.2 - Physical Function",
        "SCORE": 42.143627
      },
      {
        "INDEX": 27768,
        "PAT_ID": 5330196,
        "VISIT_NO": 208578133,
        "ASSESSMENT_ID": 127775,
        "ASSESSMENT_START_DTM": "1/21/2016 11:05:43 AM",
        "FORM_ID": 1123,
        "FORM": "PROMIS Bank v1.2 - Physical Function",
        "SCORE": 44.980507
      },
      {
        "INDEX": 47053,
        "PAT_ID": 5330196,
        "VISIT_NO": 214515373,
        "ASSESSMENT_ID": 215641,
        "ASSESSMENT_START_DTM": "8/11/2016 8:07:03 AM",
        "FORM_ID": 1123,
        "FORM": "PROMIS Bank v1.2 - Physical Function",
        "SCORE": 37.787846
      },
      {
        "INDEX": 47065,
        "PAT_ID": 5330196,
        "VISIT_NO": 214515373,
        "ASSESSMENT_ID": 215641,
        "ASSESSMENT_START_DTM": "8/11/2016 8:07:03 AM",
        "FORM_ID": 3,
        "FORM": "Oswestry Index (ODI)",
        "SCORE": 22
      },
      {
        "INDEX": 51753,
        "PAT_ID": 5330196,
        "VISIT_NO": 215346993,
        "ASSESSMENT_ID": 255244,
        "ASSESSMENT_START_DTM": "9/21/2016 10:03:28 AM",
        "FORM_ID": 1123,
        "FORM": "PROMIS Bank v1.2 - Physical Function",
        "SCORE": 40.1044
      }
    ]
  };

  static patientOrders = {
    Orders: [
      {
        "INDEX": 24771,
        "PAT_ID": 5330196,
        "VISIT_NO": 0,
        "ORDER_DTM": "2/26/2015",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "ARTHRODESIS GREAT TOE METATARSOPHALANGEAL JOINT",
        "ORDER_MNEMONIC": "FUSION BIG TOE,MT-P JT"
      },
      {
        "INDEX": 24772,
        "PAT_ID": 5330196,
        "VISIT_NO": 0,
        "ORDER_DTM": "10/13/2015",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "NUROPSYC TESTING PR HR W/PT & INTERPJ TIME",
        "ORDER_MNEMONIC": "NEUROPSYCH TESTING BY PSYCH/PHYS"
      },
      {
        "INDEX": 24773,
        "PAT_ID": 5330196,
        "VISIT_NO": 0,
        "ORDER_DTM": "10/13/2015",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "NEUROPSYC TSTG W/PROF I&R ADMN BY TECH PR HR",
        "ORDER_MNEMONIC": "NEUROPSYCH TESTING BY TECHNICIAN"
      },
      {
        "INDEX": 24774,
        "PAT_ID": 5330196,
        "VISIT_NO": 0,
        "ORDER_DTM": "10/13/2015",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "NUBHVL STATUS XM PR HR W/PT INTERPJ&PREPJ",
        "ORDER_MNEMONIC": "NEUROBEHAVIORAL STATUS EXAM BY PSYCH/PHYS"
      },
      {
        "INDEX": 24775,
        "PAT_ID": 5330196,
        "VISIT_NO": 0,
        "ORDER_DTM": "7/15/2016",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "NDL EMG 4 XTR W/WO RELATED PARASPINAL AREAS",
        "ORDER_MNEMONIC": "EMG, NEEDLE, 4 LIMBS"
      },
      {
        "INDEX": 24776,
        "PAT_ID": 5330196,
        "VISIT_NO": 194796302,
        "ORDER_DTM": "10/1/2013 4:38:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "RANIBIZUMAB",
        "ORDER_MNEMONIC": "RANIBIZUMAB 0.5 MG/0.05ML IO SOLN"
      },
      {
        "INDEX": 24777,
        "PAT_ID": 5330196,
        "VISIT_NO": 195604566,
        "ORDER_DTM": "10/31/2013 3:53:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FLUOXETINE HCL",
        "ORDER_MNEMONIC": "FLUOXETINE HCL 20 MG PO CAPS"
      },
      {
        "INDEX": 24778,
        "PAT_ID": 5330196,
        "VISIT_NO": 196345029,
        "ORDER_DTM": "1/3/2014 1:53:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DIAZEPAM",
        "ORDER_MNEMONIC": "DIAZEPAM 5 MG PO TABS"
      },
      {
        "INDEX": 24779,
        "PAT_ID": 5330196,
        "VISIT_NO": 196519169,
        "ORDER_DTM": "2/25/2014 1:21:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 24780,
        "PAT_ID": 5330196,
        "VISIT_NO": 196519169,
        "ORDER_DTM": "2/25/2014 1:22:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CELECOXIB",
        "ORDER_MNEMONIC": "CELECOXIB 200 MG PO CAPS"
      },
      {
        "INDEX": 24781,
        "PAT_ID": 5330196,
        "VISIT_NO": 196797789,
        "ORDER_DTM": "1/31/2014 1:15:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRAMADOL HCL",
        "ORDER_MNEMONIC": "TRAMADOL HCL 50 MG PO TABS"
      },
      {
        "INDEX": 24782,
        "PAT_ID": 5330196,
        "VISIT_NO": 196797789,
        "ORDER_DTM": "1/31/2014 1:15:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROCHLOROTHIAZIDE",
        "ORDER_MNEMONIC": "HYDROCHLOROTHIAZIDE 25 MG PO TABS"
      },
      {
        "INDEX": 24783,
        "PAT_ID": 5330196,
        "VISIT_NO": 196797789,
        "ORDER_DTM": "1/31/2014 12:02:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ACETAMINOPHEN",
        "ORDER_MNEMONIC": "ACETAMINOPHEN 325 MG PO TABS"
      },
      {
        "INDEX": 24784,
        "PAT_ID": 5330196,
        "VISIT_NO": 196812904,
        "ORDER_DTM": "1/30/2014 9:48:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "GABAPENTIN",
        "ORDER_MNEMONIC": "GABAPENTIN 100 MG PO CAPS"
      },
      {
        "INDEX": 24785,
        "PAT_ID": 5330196,
        "VISIT_NO": 196847616,
        "ORDER_DTM": "2/14/2014 11:55:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "POTASSIUM CHLORIDE CRYS CR",
        "ORDER_MNEMONIC": "POTASSIUM CHLORIDE CRYS ER 10 MEQ PO TBCR"
      },
      {
        "INDEX": 24786,
        "PAT_ID": 5330196,
        "VISIT_NO": 196847616,
        "ORDER_DTM": "2/14/2014 11:55:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ATORVASTATIN CALCIUM",
        "ORDER_MNEMONIC": "ATORVASTATIN CALCIUM 20 MG PO TABS"
      },
      {
        "INDEX": 24787,
        "PAT_ID": 5330196,
        "VISIT_NO": 196847616,
        "ORDER_DTM": "2/14/2014 11:55:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OMEPRAZOLE",
        "ORDER_MNEMONIC": "OMEPRAZOLE 20 MG PO CPDR"
      },
      {
        "INDEX": 24788,
        "PAT_ID": 5330196,
        "VISIT_NO": 196847616,
        "ORDER_DTM": "2/14/2014 11:55:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "POLYETHYLENE GLYCOL 3350",
        "ORDER_MNEMONIC": "POLYETHYLENE GLYCOL 3350 PO POWD"
      },
      {
        "INDEX": 24789,
        "PAT_ID": 5330196,
        "VISIT_NO": 196847616,
        "ORDER_DTM": "2/14/2014 11:13:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRAMADOL HCL",
        "ORDER_MNEMONIC": "TRAMADOL HCL 50 MG PO TBDP"
      },
      {
        "INDEX": 24790,
        "PAT_ID": 5330196,
        "VISIT_NO": 196847616,
        "ORDER_DTM": "2/14/2014 11:55:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SENNOSIDES-DOCUSATE SODIUM",
        "ORDER_MNEMONIC": "SENNOSIDES-DOCUSATE SODIUM 8.6-50 MG PO TABS"
      },
      {
        "INDEX": 24791,
        "PAT_ID": 5330196,
        "VISIT_NO": 197078635,
        "ORDER_DTM": "9/17/2014 2:16:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE-ACETAMINOPHEN",
        "ORDER_MNEMONIC": "OXYCODONE-ACETAMINOPHEN 5-325 MG PO TABS"
      },
      {
        "INDEX": 24792,
        "PAT_ID": 5330196,
        "VISIT_NO": 197109021,
        "ORDER_DTM": "2/19/2014 3:03:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 24793,
        "PAT_ID": 5330196,
        "VISIT_NO": 197223787,
        "ORDER_DTM": "3/12/2014 9:25:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL PO"
      },
      {
        "INDEX": 24794,
        "PAT_ID": 5330196,
        "VISIT_NO": 197223787,
        "ORDER_DTM": "3/12/2014 9:25:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROCHLOROTHIAZIDE",
        "ORDER_MNEMONIC": "HYDROCHLOROTHIAZIDE PO"
      },
      {
        "INDEX": 24795,
        "PAT_ID": 5330196,
        "VISIT_NO": 197223787,
        "ORDER_DTM": "3/12/2014 9:25:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OMEPRAZOLE",
        "ORDER_MNEMONIC": "OMEPRAZOLE PO"
      },
      {
        "INDEX": 24796,
        "PAT_ID": 5330196,
        "VISIT_NO": 197534996,
        "ORDER_DTM": "3/28/2014 11:19:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRAZODONE HCL",
        "ORDER_MNEMONIC": "TRAZODONE HCL 50 MG PO TABS"
      },
      {
        "INDEX": 24797,
        "PAT_ID": 5330196,
        "VISIT_NO": 198151058,
        "ORDER_DTM": "5/6/2014 10:35:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FLUOXETINE HCL",
        "ORDER_MNEMONIC": "PROZAC PO"
      },
      {
        "INDEX": 24798,
        "PAT_ID": 5330196,
        "VISIT_NO": 198151058,
        "ORDER_DTM": "5/6/2014 10:35:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Aspirin",
        "ORDER_MNEMONIC": "ASPIRIN 81 MG PO TABLET"
      },
      {
        "INDEX": 24799,
        "PAT_ID": 5330196,
        "VISIT_NO": 198151058,
        "ORDER_DTM": "5/6/2014 10:35:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Lansoprazole",
        "ORDER_MNEMONIC": "PREVACID PO"
      },
      {
        "INDEX": 24800,
        "PAT_ID": 5330196,
        "VISIT_NO": 198195001,
        "ORDER_DTM": "4/30/2014 9:26:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SULFAMETHOXAZOLE-TRIMETHOPRIM",
        "ORDER_MNEMONIC": "SULFAMETHOXAZOLE-TRIMETHOPRIM 800-160 MG PO TABS"
      },
      {
        "INDEX": 24801,
        "PAT_ID": 5330196,
        "VISIT_NO": 198407438,
        "ORDER_DTM": "5/21/2014 3:32:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FLUOCINONIDE",
        "ORDER_MNEMONIC": "FLUOCINONIDE 0.05 % EX SOLN"
      },
      {
        "INDEX": 24802,
        "PAT_ID": 5330196,
        "VISIT_NO": 198553429,
        "ORDER_DTM": "7/29/2014 3:49:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "RANIBIZUMAB",
        "ORDER_MNEMONIC": "RANIBIZUMAB 0.5 MG/0.05ML IO SOLN"
      },
      {
        "INDEX": 24803,
        "PAT_ID": 5330196,
        "VISIT_NO": 198709006,
        "ORDER_DTM": "6/1/2014 12:04:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FLUOXETINE HCL",
        "ORDER_MNEMONIC": "FLUOXETINE HCL 20 MG PO CAPS"
      },
      {
        "INDEX": 24804,
        "PAT_ID": 5330196,
        "VISIT_NO": 199230341,
        "ORDER_DTM": "7/10/2014 5:46:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BENAZEPRIL HCL",
        "ORDER_MNEMONIC": "BENAZEPRIL HCL 5 MG PO TABS"
      },
      {
        "INDEX": 24805,
        "PAT_ID": 5330196,
        "VISIT_NO": 199294246,
        "ORDER_DTM": "7/7/2014 1:22:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BENAZEPRIL-HYDROCHLOROTHIAZIDE",
        "ORDER_MNEMONIC": "BENAZEPRIL-HYDROCHLOROTHIAZIDE 10-12.5 MG PO TABS"
      },
      {
        "INDEX": 24806,
        "PAT_ID": 5330196,
        "VISIT_NO": 199591662,
        "ORDER_DTM": "8/8/2014 10:44:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BENAZEPRIL HCL",
        "ORDER_MNEMONIC": "BENAZEPRIL HCL 10 MG PO TABS"
      },
      {
        "INDEX": 24807,
        "PAT_ID": 5330196,
        "VISIT_NO": 199685391,
        "ORDER_DTM": "9/2/2014 3:40:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "RANIBIZUMAB",
        "ORDER_MNEMONIC": "RANIBIZUMAB 0.5 MG/0.05ML IO SOLN"
      },
      {
        "INDEX": 24808,
        "PAT_ID": 5330196,
        "VISIT_NO": 200272551,
        "ORDER_DTM": "9/30/2014 2:37:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OMEGA-3 FATTY ACIDS",
        "ORDER_MNEMONIC": "FISH OIL 1000 MG PO CAPS"
      },
      {
        "INDEX": 24809,
        "PAT_ID": 5330196,
        "VISIT_NO": 200272551,
        "ORDER_DTM": "9/30/2014 2:37:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Multiple Vitamins-Minerals",
        "ORDER_MNEMONIC": "PRESERVISION AREDS 2 PO CAPS"
      },
      {
        "INDEX": 24810,
        "PAT_ID": 5330196,
        "VISIT_NO": 202322104,
        "ORDER_DTM": "2/3/2015 4:24:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "RANIBIZUMAB",
        "ORDER_MNEMONIC": "RANIBIZUMAB 0.5 MG/0.05ML IO SOLN"
      },
      {
        "INDEX": 24811,
        "PAT_ID": 5330196,
        "VISIT_NO": 202355819,
        "ORDER_DTM": "2/3/2015 11:12:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DICLOFENAC SODIUM",
        "ORDER_MNEMONIC": "VOLTAREN 1 % TD GEL"
      },
      {
        "INDEX": 24812,
        "PAT_ID": 5330196,
        "VISIT_NO": 202355819,
        "ORDER_DTM": "2/3/2015 11:12:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BENAZEPRIL HCL",
        "ORDER_MNEMONIC": "BENAZEPRIL HCL 10 MG PO TABS"
      },
      {
        "INDEX": 24813,
        "PAT_ID": 5330196,
        "VISIT_NO": 202355819,
        "ORDER_DTM": "2/3/2015 11:12:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FLUOCINOLONE ACETONIDE",
        "ORDER_MNEMONIC": "FLUOCINOLONE ACETONIDE SCALP 0.01 % EX OIL"
      },
      {
        "INDEX": 24814,
        "PAT_ID": 5330196,
        "VISIT_NO": 202355819,
        "ORDER_DTM": "2/3/2015 11:12:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "KETOCONAZOLE",
        "ORDER_MNEMONIC": "KETOCONAZOLE 2 % EX SHAM"
      },
      {
        "INDEX": 24815,
        "PAT_ID": 5330196,
        "VISIT_NO": 202785476,
        "ORDER_DTM": "1/16/2015 12:11:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DICLOFENAC SODIUM",
        "ORDER_MNEMONIC": "DICLOFENAC SODIUM 1 % TD GEL"
      },
      {
        "INDEX": 24816,
        "PAT_ID": 5330196,
        "VISIT_NO": 203093447,
        "ORDER_DTM": "1/30/2015 3:50:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "KETOCONAZOLE",
        "ORDER_MNEMONIC": "KETOCONAZOLE 2 % EX SHAM"
      },
      {
        "INDEX": 24817,
        "PAT_ID": 5330196,
        "VISIT_NO": 203093447,
        "ORDER_DTM": "1/30/2015 3:52:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FLUOCINOLONE ACETONIDE",
        "ORDER_MNEMONIC": "FLUOCINOLONE ACETONIDE SCALP 0.01 % EX OIL"
      },
      {
        "INDEX": 24818,
        "PAT_ID": 5330196,
        "VISIT_NO": 203524379,
        "ORDER_DTM": "2/21/2015 10:12:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "SODIUM CHLORIDE 0.9 % IV BOLUS"
      },
      {
        "INDEX": 24819,
        "PAT_ID": 5330196,
        "VISIT_NO": 203524379,
        "ORDER_DTM": "2/22/2015 1:16:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "AMOXICILLIN-POT CLAVULANATE",
        "ORDER_MNEMONIC": "AMOXICILLIN-POT CLAVULANATE 875-125 MG PO TABS"
      },
      {
        "INDEX": 24820,
        "PAT_ID": 5330196,
        "VISIT_NO": 203524379,
        "ORDER_DTM": "2/22/2015 12:59:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "AMPICILLIN-SULBACTAM IVPB 3 G MINI-BAG PLUS"
      },
      {
        "INDEX": 24821,
        "PAT_ID": 5330196,
        "VISIT_NO": 203524379,
        "ORDER_DTM": "2/21/2015 9:46:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "12 LEAD ECG (EKG)",
        "ORDER_MNEMONIC": "12 LEAD ECG (EKG)"
      },
      {
        "INDEX": 24822,
        "PAT_ID": 5330196,
        "VISIT_NO": 203524379,
        "ORDER_DTM": "2/22/2015 12:01:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "IOPAMIDOL",
        "ORDER_MNEMONIC": "IOPAMIDOL 76 % IV SOLN"
      },
      {
        "INDEX": 24823,
        "PAT_ID": 5330196,
        "VISIT_NO": 203874423,
        "ORDER_DTM": "3/12/2015 3:01:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "RANIBIZUMAB",
        "ORDER_MNEMONIC": "RANIBIZUMAB 0.5 MG/0.05ML IO SOLN"
      },
      {
        "INDEX": 24824,
        "PAT_ID": 5330196,
        "VISIT_NO": 203874423,
        "ORDER_DTM": "3/12/2015 2:04:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BENAZEPRIL HCL",
        "ORDER_MNEMONIC": "BENAZEPRIL HCL 10 MG PO TABS"
      },
      {
        "INDEX": 24825,
        "PAT_ID": 5330196,
        "VISIT_NO": 203918209,
        "ORDER_DTM": "3/12/2015 4:36:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FLUOCINONIDE",
        "ORDER_MNEMONIC": "FLUOCINONIDE 0.05 % EX SOLN"
      },
      {
        "INDEX": 24826,
        "PAT_ID": 5330196,
        "VISIT_NO": 204237682,
        "ORDER_DTM": "4/3/2015 9:43:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "AMLODIPINE BESYLATE",
        "ORDER_MNEMONIC": "AMLODIPINE BESYLATE 2.5 MG PO TABS"
      },
      {
        "INDEX": 24827,
        "PAT_ID": 5330196,
        "VISIT_NO": 204500987,
        "ORDER_DTM": "4/9/2015 5:10:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ATORVASTATIN CALCIUM",
        "ORDER_MNEMONIC": "ATORVASTATIN CALCIUM 40 MG PO TABS"
      },
      {
        "INDEX": 24828,
        "PAT_ID": 5330196,
        "VISIT_NO": 204607991,
        "ORDER_DTM": "4/21/2015 4:44:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "RANIBIZUMAB",
        "ORDER_MNEMONIC": "RANIBIZUMAB 0.5 MG/0.05ML IO SOLN"
      },
      {
        "INDEX": 24829,
        "PAT_ID": 5330196,
        "VISIT_NO": 204623668,
        "ORDER_DTM": "5/5/2015 2:27:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "BX SKIN SUBCUTANEOUS&/MUCOUS MEMBRANE 1 LESION",
        "ORDER_MNEMONIC": "BIOPSY OF SKIN LESION"
      },
      {
        "INDEX": 24830,
        "PAT_ID": 5330196,
        "VISIT_NO": 205574029,
        "ORDER_DTM": "6/2/2015 3:28:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FLUOXETINE HCL",
        "ORDER_MNEMONIC": "FLUOXETINE HCL 20 MG PO CAPS"
      },
      {
        "INDEX": 24831,
        "PAT_ID": 5330196,
        "VISIT_NO": 205872401,
        "ORDER_DTM": "7/8/2015 12:17:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "RANIBIZUMAB",
        "ORDER_MNEMONIC": "RANIBIZUMAB 0.5 MG/0.05ML IO SOLN"
      },
      {
        "INDEX": 24832,
        "PAT_ID": 5330196,
        "VISIT_NO": 205891782,
        "ORDER_DTM": "6/17/2015 6:29:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "SODIUM CHLORIDE 0.9 % IV BOLUS"
      },
      {
        "INDEX": 24833,
        "PAT_ID": 5330196,
        "VISIT_NO": 205891782,
        "ORDER_DTM": "6/17/2015 6:30:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "SODIUM CHLORIDE 0.9 % IV BOLUS"
      },
      {
        "INDEX": 24834,
        "PAT_ID": 5330196,
        "VISIT_NO": 205891782,
        "ORDER_DTM": "6/17/2015 6:40:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "12 LEAD ECG (EKG)",
        "ORDER_MNEMONIC": "12 LEAD ECG (EKG)"
      },
      {
        "INDEX": 24835,
        "PAT_ID": 5330196,
        "VISIT_NO": 206090292,
        "ORDER_DTM": "7/6/2015 12:56:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ZINC SULFATE",
        "ORDER_MNEMONIC": "ZINC SULFATE 220 (50 ZN) MG PO TABS"
      },
      {
        "INDEX": 24836,
        "PAT_ID": 5330196,
        "VISIT_NO": 206090292,
        "ORDER_DTM": "7/6/2015 11:56:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BENAZEPRIL HCL",
        "ORDER_MNEMONIC": "BENAZEPRIL HCL 10 MG PO TABS"
      },
      {
        "INDEX": 24837,
        "PAT_ID": 5330196,
        "VISIT_NO": 206090292,
        "ORDER_DTM": "7/6/2015 12:56:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PT FALLS ASSESS DOCD W/O FALL/INJURY PAST YEAR",
        "ORDER_MNEMONIC": "PT FALLS ASSESS DOC 0-1 FALLS W/OUT INJ PAST YR"
      },
      {
        "INDEX": 24838,
        "PAT_ID": 5330196,
        "VISIT_NO": 206090292,
        "ORDER_DTM": "7/6/2015 12:56:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "NASAL ENDOSCOPY DIAGNOSTIC UNI/BI SPX",
        "ORDER_MNEMONIC": "NASAL ENDOSCOPY,DX"
      },
      {
        "INDEX": 24839,
        "PAT_ID": 5330196,
        "VISIT_NO": 206265122,
        "ORDER_DTM": "8/19/2015 11:37:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "RANIBIZUMAB",
        "ORDER_MNEMONIC": "RANIBIZUMAB 0.5 MG/0.05ML IO SOLN"
      },
      {
        "INDEX": 24840,
        "PAT_ID": 5330196,
        "VISIT_NO": 206265122,
        "ORDER_DTM": "8/19/2015 11:37:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "RANIBIZUMAB",
        "ORDER_MNEMONIC": "RANIBIZUMAB 0.5 MG/0.05ML IO SOLN"
      },
      {
        "INDEX": 24841,
        "PAT_ID": 5330196,
        "VISIT_NO": 206284838,
        "ORDER_DTM": "8/11/2015 1:53:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PRAVASTATIN SODIUM",
        "ORDER_MNEMONIC": "PRAVASTATIN SODIUM 20 MG PO TABS"
      },
      {
        "INDEX": 24842,
        "PAT_ID": 5330196,
        "VISIT_NO": 206751995,
        "ORDER_DTM": "8/4/2015 3:28:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ROSUVASTATIN CALCIUM",
        "ORDER_MNEMONIC": "ROSUVASTATIN CALCIUM 20 MG PO TABS"
      },
      {
        "INDEX": 24843,
        "PAT_ID": 5330196,
        "VISIT_NO": 206835823,
        "ORDER_DTM": "10/6/2015 10:52:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "OPTIC NERVE HEAD EVALUATION PERFORMED",
        "ORDER_MNEMONIC": "OPTIC NERVE HEAD EVALUATION PERFORMED"
      },
      {
        "INDEX": 24844,
        "PAT_ID": 5330196,
        "VISIT_NO": 206837151,
        "ORDER_DTM": "9/14/2015 1:30:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Cholecalciferol",
        "ORDER_MNEMONIC": "VITAMIN D3 (CHOLECALCIFEROL) 1000 UNITS PO TABLET"
      },
      {
        "INDEX": 24845,
        "PAT_ID": 5330196,
        "VISIT_NO": 206837151,
        "ORDER_DTM": "9/14/2015 2:05:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "LARYNGOSCOPY FLEXIBLE FIBEROPTIC DIAGNOSTIC",
        "ORDER_MNEMONIC": "LARYNGOSCOPY,FLEX FIBER,DIAGNOSTIC"
      },
      {
        "INDEX": 24846,
        "PAT_ID": 5330196,
        "VISIT_NO": 206849254,
        "ORDER_DTM": "8/10/2015 10:08:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BENAZEPRIL HCL",
        "ORDER_MNEMONIC": "BENAZEPRIL HCL 10 MG PO TABS"
      },
      {
        "INDEX": 24847,
        "PAT_ID": 5330196,
        "VISIT_NO": 207054020,
        "ORDER_DTM": "9/30/2015 10:59:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BENAZEPRIL HCL",
        "ORDER_MNEMONIC": "BENAZEPRIL HCL 10 MG PO TABS"
      },
      {
        "INDEX": 24848,
        "PAT_ID": 5330196,
        "VISIT_NO": 207054020,
        "ORDER_DTM": "9/30/2015 11:36:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "RANIBIZUMAB",
        "ORDER_MNEMONIC": "RANIBIZUMAB 0.5 MG/0.05ML IO SOLN"
      },
      {
        "INDEX": 24849,
        "PAT_ID": 5330196,
        "VISIT_NO": 207242673,
        "ORDER_DTM": "11/6/2015 4:57:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "NEUROPSYC TSTG W/PROF I&R ADMN BY TECH PR HR",
        "ORDER_MNEMONIC": "NEUROPSYCH TESTING BY TECHNICIAN"
      },
      {
        "INDEX": 24850,
        "PAT_ID": 5330196,
        "VISIT_NO": 207242673,
        "ORDER_DTM": "11/6/2015 4:57:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "NUROPSYC TESTING PR HR W/PT & INTERPJ TIME",
        "ORDER_MNEMONIC": "NEUROPSYCH TESTING BY PSYCH/PHYS"
      },
      {
        "INDEX": 24851,
        "PAT_ID": 5330196,
        "VISIT_NO": 207321328,
        "ORDER_DTM": "9/4/2015 11:31:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FLUOXETINE HCL",
        "ORDER_MNEMONIC": "FLUOXETINE HCL 20 MG PO CAPS"
      },
      {
        "INDEX": 24852,
        "PAT_ID": 5330196,
        "VISIT_NO": 207765168,
        "ORDER_DTM": "10/5/2015 11:18:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DIAZEPAM",
        "ORDER_MNEMONIC": "DIAZEPAM 5 MG PO TABS"
      },
      {
        "INDEX": 24853,
        "PAT_ID": 5330196,
        "VISIT_NO": 207999449,
        "ORDER_DTM": "11/9/2015 2:02:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Calcium",
        "ORDER_MNEMONIC": "CALCIUM PO"
      },
      {
        "INDEX": 24854,
        "PAT_ID": 5330196,
        "VISIT_NO": 207999449,
        "ORDER_DTM": "11/9/2015 1:28:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYBUTYNIN CHLORIDE",
        "ORDER_MNEMONIC": "OXYBUTYNIN CHLORIDE 5 MG PO TABS"
      },
      {
        "INDEX": 24855,
        "PAT_ID": 5330196,
        "VISIT_NO": 208060063,
        "ORDER_DTM": "10/5/2015 3:34:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "POTASSIUM CHLORIDE CRYS CR",
        "ORDER_MNEMONIC": "POTASSIUM CHLORIDE CRYS ER 10 MEQ PO TBCR"
      },
      {
        "INDEX": 24856,
        "PAT_ID": 5330196,
        "VISIT_NO": 208130739,
        "ORDER_DTM": "10/29/2015 11:58:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PATCH/APPLICATION TEST SPECIFY NUMBER TESTS",
        "ORDER_MNEMONIC": "ALLERGY PATCH TESTS"
      },
      {
        "INDEX": 24857,
        "PAT_ID": 5330196,
        "VISIT_NO": 208130739,
        "ORDER_DTM": "10/29/2015 11:58:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "DESTRUCTION PREMALIGNANT LESION 1ST",
        "ORDER_MNEMONIC": "DESTRUC BENIGN/PREMAL,FIRST LESION"
      },
      {
        "INDEX": 24858,
        "PAT_ID": 5330196,
        "VISIT_NO": 208198390,
        "ORDER_DTM": "10/30/2015 10:08:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PRAVASTATIN SODIUM",
        "ORDER_MNEMONIC": "PRAVASTATIN SODIUM 20 MG PO TABS"
      },
      {
        "INDEX": 24859,
        "PAT_ID": 5330196,
        "VISIT_NO": 208198390,
        "ORDER_DTM": "10/30/2015 9:08:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CALCIUM-MAGNESIUM-VITAMIN D",
        "ORDER_MNEMONIC": "CALCIUM 500 PO"
      },
      {
        "INDEX": 24860,
        "PAT_ID": 5330196,
        "VISIT_NO": 208198390,
        "ORDER_DTM": "10/30/2015 10:08:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYBUTYNIN CHLORIDE",
        "ORDER_MNEMONIC": "OXYBUTYNIN CHLORIDE 5 MG PO TABS"
      },
      {
        "INDEX": 24861,
        "PAT_ID": 5330196,
        "VISIT_NO": 208198390,
        "ORDER_DTM": "10/30/2015 9:53:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "MEAS POST-VOIDING RESIDUAL URINE&/BLADDER CAP",
        "ORDER_MNEMONIC": "MEAS,POST-VOID RES,US,NON-IMAGING"
      },
      {
        "INDEX": 24862,
        "PAT_ID": 5330196,
        "VISIT_NO": 208579582,
        "ORDER_DTM": "12/14/2015 3:40:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PATCH/APPLICATION TEST SPECIFY NUMBER TESTS",
        "ORDER_MNEMONIC": "ALLERGY PATCH TESTS"
      },
      {
        "INDEX": 24863,
        "PAT_ID": 5330196,
        "VISIT_NO": 208579584,
        "ORDER_DTM": "12/18/2015 12:23:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CEPHALEXIN",
        "ORDER_MNEMONIC": "CEPHALEXIN 500 MG PO CAPS"
      },
      {
        "INDEX": 24864,
        "PAT_ID": 5330196,
        "VISIT_NO": 208579584,
        "ORDER_DTM": "12/18/2015 12:23:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Clobetasol Propionate",
        "ORDER_MNEMONIC": "CLOBETASOL PROPIONATE 0.05 % EX SOLN"
      },
      {
        "INDEX": 24865,
        "PAT_ID": 5330196,
        "VISIT_NO": 209543161,
        "ORDER_DTM": "12/17/2015 1:38:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FLUOXETINE HCL",
        "ORDER_MNEMONIC": "FLUOXETINE HCL 20 MG PO CAPS"
      },
      {
        "INDEX": 24866,
        "PAT_ID": 5330196,
        "VISIT_NO": 209602869,
        "ORDER_DTM": "12/21/2015 12:17:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FLUOXETINE HCL",
        "ORDER_MNEMONIC": "FLUOXETINE HCL 20 MG PO CAPS"
      },
      {
        "INDEX": 24867,
        "PAT_ID": 5330196,
        "VISIT_NO": 209640543,
        "ORDER_DTM": "2/2/2016 2:56:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "DILATED MACULAR EXAM PERFORMED",
        "ORDER_MNEMONIC": "DILATED MACULAR EXAM PERFORMED"
      },
      {
        "INDEX": 24868,
        "PAT_ID": 5330196,
        "VISIT_NO": 209640543,
        "ORDER_DTM": "2/2/2016 3:37:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "RANIBIZUMAB",
        "ORDER_MNEMONIC": "RANIBIZUMAB 0.5 MG/0.05ML IO SOLN"
      },
      {
        "INDEX": 24869,
        "PAT_ID": 5330196,
        "VISIT_NO": 209855432,
        "ORDER_DTM": "1/6/2016 8:13:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FLUOXETINE HCL",
        "ORDER_MNEMONIC": "PROZAC 20 MG PO CAPS"
      },
      {
        "INDEX": 24870,
        "PAT_ID": 5330196,
        "VISIT_NO": 210263317,
        "ORDER_DTM": "1/25/2016 4:49:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "NITROFURANTOIN MONOHYD MACRO",
        "ORDER_MNEMONIC": "NITROFURANTOIN MONOHYD MACRO 100 MG PO CAPS"
      },
      {
        "INDEX": 24871,
        "PAT_ID": 5330196,
        "VISIT_NO": 210737091,
        "ORDER_DTM": "2/16/2016 9:42:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DIAZEPAM",
        "ORDER_MNEMONIC": "DIAZEPAM 5 MG/ML IJ SOLN"
      },
      {
        "INDEX": 24872,
        "PAT_ID": 5330196,
        "VISIT_NO": 210737091,
        "ORDER_DTM": "2/16/2016 11:06:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "GADOBENATE DIMEGLUMINE",
        "ORDER_MNEMONIC": "GADOBENATE DIMEGLUMINE 529 MG/ML IV SOLN"
      },
      {
        "INDEX": 24873,
        "PAT_ID": 5330196,
        "VISIT_NO": 210737091,
        "ORDER_DTM": "2/17/2016 12:50:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MECLIZINE HCL",
        "ORDER_MNEMONIC": "MECLIZINE HCL 25 MG PO TABS"
      },
      {
        "INDEX": 24874,
        "PAT_ID": 5330196,
        "VISIT_NO": 210913137,
        "ORDER_DTM": "2/24/2016 12:27:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BENAZEPRIL HCL",
        "ORDER_MNEMONIC": "BENAZEPRIL HCL 10 MG PO TABS"
      },
      {
        "INDEX": 24875,
        "PAT_ID": 5330196,
        "VISIT_NO": 211083516,
        "ORDER_DTM": "3/2/2016 2:48:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "SODIUM CHLORIDE 0.9 % IV BOLUS"
      },
      {
        "INDEX": 24876,
        "PAT_ID": 5330196,
        "VISIT_NO": 211083516,
        "ORDER_DTM": "3/2/2016 5:16:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ACETAMINOPHEN",
        "ORDER_MNEMONIC": "ACETAMINOPHEN 325 MG PO TABS"
      },
      {
        "INDEX": 24877,
        "PAT_ID": 5330196,
        "VISIT_NO": 211083516,
        "ORDER_DTM": "3/2/2016 2:11:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "12 LEAD ECG (EKG)",
        "ORDER_MNEMONIC": "12 LEAD ECG (EKG)"
      },
      {
        "INDEX": 24878,
        "PAT_ID": 5330196,
        "VISIT_NO": 211689453,
        "ORDER_DTM": "5/12/2016 3:38:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BENAZEPRIL HCL",
        "ORDER_MNEMONIC": "BENAZEPRIL HCL PO"
      },
      {
        "INDEX": 24879,
        "PAT_ID": 5330196,
        "VISIT_NO": 212133781,
        "ORDER_DTM": "4/19/2016 3:38:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FLUOXETINE HCL",
        "ORDER_MNEMONIC": "FLUOXETINE HCL 10 MG PO CAPS"
      },
      {
        "INDEX": 24880,
        "PAT_ID": 5330196,
        "VISIT_NO": 212267561,
        "ORDER_DTM": "4/26/2016 8:29:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "REMOVAL IMPACTED CERUMEN INSTRUMENTATION UNILAT",
        "ORDER_MNEMONIC": "REMOVE IMPACTED EAR WAX"
      },
      {
        "INDEX": 24881,
        "PAT_ID": 5330196,
        "VISIT_NO": 212507192,
        "ORDER_DTM": "5/19/2016 11:13:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "COMPRE AUDIOMETRY THRESHOLD EVAL SP RECOGNIJ",
        "ORDER_MNEMONIC": "COMPREHENSIVE HEARING TEST"
      },
      {
        "INDEX": 24882,
        "PAT_ID": 5330196,
        "VISIT_NO": 213103449,
        "ORDER_DTM": "5/31/2016 9:40:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Benazepril HCl",
        "ORDER_MNEMONIC": "BENAZEPRIL HCL 10 MG PO TABLET"
      },
      {
        "INDEX": 24883,
        "PAT_ID": 5330196,
        "VISIT_NO": 213280655,
        "ORDER_DTM": "6/10/2016 5:07:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FLUoxetine HCl",
        "ORDER_MNEMONIC": "PROZAC 20 MG PO CAPS"
      },
      {
        "INDEX": 24884,
        "PAT_ID": 5330196,
        "VISIT_NO": 213280655,
        "ORDER_DTM": "6/8/2016 10:34:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FLUOXETINE HCL",
        "ORDER_MNEMONIC": "PROZAC 20 MG PO CAPS"
      },
      {
        "INDEX": 24885,
        "PAT_ID": 5330196,
        "VISIT_NO": 213647303,
        "ORDER_DTM": "6/22/2016 6:06:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "12 LEAD ECG (EKG)",
        "ORDER_MNEMONIC": "12 LEAD ECG (EKG)"
      },
      {
        "INDEX": 24886,
        "PAT_ID": 5330196,
        "VISIT_NO": 213647303,
        "ORDER_DTM": "6/22/2016 10:00:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "IOPAMIDOL",
        "ORDER_MNEMONIC": "IOPAMIDOL 76 % IV SOLN"
      },
      {
        "INDEX": 24887,
        "PAT_ID": 5330196,
        "VISIT_NO": 214127921,
        "ORDER_DTM": "7/19/2016 12:34:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "NERVE CONDUCTION STUDIES 5-6 STUDIES",
        "ORDER_MNEMONIC": "NERVE CONDUCTION STUDIES 5-6 STUDIES"
      },
      {
        "INDEX": 24888,
        "PAT_ID": 5330196,
        "VISIT_NO": 214127921,
        "ORDER_DTM": "7/19/2016 12:34:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "NEEDLE EMG EA EXTREMITY W/PARASPINL AREA LIMITED",
        "ORDER_MNEMONIC": "NEEDLE EMG EA EXTREMITY W/PARASPINL AREA LIMITED"
      },
      {
        "INDEX": 24889,
        "PAT_ID": 5330196,
        "VISIT_NO": 214129741,
        "ORDER_DTM": "7/18/2016 4:41:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Benazepril HCl",
        "ORDER_MNEMONIC": "BENAZEPRIL HCL 20 MG PO TABS"
      },
      {
        "INDEX": 24890,
        "PAT_ID": 5330196,
        "VISIT_NO": 214240912,
        "ORDER_DTM": "7/21/2016 9:06:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Simvastatin",
        "ORDER_MNEMONIC": "SIMVASTATIN 40 MG PO TABS"
      },
      {
        "INDEX": 24891,
        "PAT_ID": 5330196,
        "VISIT_NO": 214467573,
        "ORDER_DTM": "8/2/2016 4:37:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "BX SKIN SUBCUTANEOUS&/MUCOUS MEMBRANE 1 LESION",
        "ORDER_MNEMONIC": "BIOPSY OF SKIN LESION"
      },
      {
        "INDEX": 24892,
        "PAT_ID": 5330196,
        "VISIT_NO": 214493236,
        "ORDER_DTM": "8/2/2016 5:35:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Cyanocobalamin",
        "ORDER_MNEMONIC": "VITAMIN B 12 PO"
      },
      {
        "INDEX": 24893,
        "PAT_ID": 5330196,
        "VISIT_NO": 214815341,
        "ORDER_DTM": "8/17/2016 3:58:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Potassium Chloride Crys CR",
        "ORDER_MNEMONIC": "POTASSIUM CHLORIDE CRYS ER 10 MEQ PO TBCR"
      },
      {
        "INDEX": 24894,
        "PAT_ID": 5330196,
        "VISIT_NO": 214964249,
        "ORDER_DTM": "8/24/2016 10:29:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Fluocinonide",
        "ORDER_MNEMONIC": "FLUOCINONIDE 0.05 % EX SOLN"
      },
      {
        "INDEX": 24895,
        "PAT_ID": 5330196,
        "VISIT_NO": 215428707,
        "ORDER_DTM": "12/13/2016 1:12:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "INJECTION SINGLE/MLT TRIGGER POINT 1/2 MUSCLES",
        "ORDER_MNEMONIC": "INJECT TRIGGER POINT, 1 OR 2"
      },
      {
        "INDEX": 24896,
        "PAT_ID": 5330196,
        "VISIT_NO": 215428707,
        "ORDER_DTM": "12/15/2016 4:32:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Dexamethasone Sodium Phosphate",
        "ORDER_MNEMONIC": "DEXAMETHASONE SODIUM PHOSPHATE 4 MG/ML IJ SOLN"
      },
      {
        "INDEX": 24897,
        "PAT_ID": 5330196,
        "VISIT_NO": 215428707,
        "ORDER_DTM": "12/15/2016 4:32:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Lidocaine HCl",
        "ORDER_MNEMONIC": "LIDOCAINE HCL 1 % IJ SOLN"
      },
      {
        "INDEX": 24898,
        "PAT_ID": 5330196,
        "VISIT_NO": 215428707,
        "ORDER_DTM": "12/15/2016 4:32:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Bupivacaine HCl",
        "ORDER_MNEMONIC": "BUPIVACAINE HCL 0.25 % IJ SOLN"
      },
      {
        "INDEX": 24899,
        "PAT_ID": 5330196,
        "VISIT_NO": 215745091,
        "ORDER_DTM": "9/28/2016 12:13:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Potassium Chloride Crys CR",
        "ORDER_MNEMONIC": "KLOR-CON M10 10 MEQ PO TBCR"
      },
      {
        "INDEX": 24900,
        "PAT_ID": 5330196,
        "VISIT_NO": 215800475,
        "ORDER_DTM": "9/29/2016 12:26:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ALPRAZolam",
        "ORDER_MNEMONIC": "ALPRAZOLAM 0.25 MG PO TABLET"
      },
      {
        "INDEX": 24901,
        "PAT_ID": 5330196,
        "VISIT_NO": 216261515,
        "ORDER_DTM": "11/17/2016 2:05:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Ranibizumab",
        "ORDER_MNEMONIC": "RANIBIZUMAB 0.5 MG/0.05ML IO SOLN"
      },
      {
        "INDEX": 24902,
        "PAT_ID": 5330196,
        "VISIT_NO": 217338003,
        "ORDER_DTM": "12/7/2016 11:47:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Azithromycin",
        "ORDER_MNEMONIC": "AZITHROMYCIN 250 MG PO TABLET"
      },
      {
        "INDEX": 24903,
        "PAT_ID": 5330196,
        "VISIT_NO": 217402384,
        "ORDER_DTM": "12/9/2016 5:32:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "COLLECTION VENOUS BLOOD VENIPUNCTURE",
        "ORDER_MNEMONIC": "COLLECTION VENOUS BLOOD,VENIPUNCTURE"
      }
    ]
  };

  static similarOrders = {
    20753417: [
      {
        "INDEX": 217857,
        "PAT_ID": 20753417,
        "VISIT_NO": 0,
        "ORDER_DTM": "3/7/2016",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "HLTH&BEHAVIOR IVNTJ EA 15 MIN INDIV",
        "ORDER_MNEMONIC": "HEAL & BEHAV INTERVENT,EA 15 MIN,INDIV"
      },
      {
        "INDEX": 217858,
        "PAT_ID": 20753417,
        "VISIT_NO": 0,
        "ORDER_DTM": "2/7/2017",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "IV INFUSION THERAPY/PROPHYLAXIS /DX 1ST TO 1 HR",
        "ORDER_MNEMONIC": "IV INFUSION, THERAP/PROPH/DIAGNOST,INITIAL,1ST HOUR"
      },
      {
        "INDEX": 217859,
        "PAT_ID": 20753417,
        "VISIT_NO": 198939715,
        "ORDER_DTM": "7/3/2014 11:00:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "NDL EMG 1 XTR W/WO RELATED PARASPINAL AREAS",
        "ORDER_MNEMONIC": "EMG, NEEDLE, ONE LIMB"
      },
      {
        "INDEX": 217860,
        "PAT_ID": 20753417,
        "VISIT_NO": 198939715,
        "ORDER_DTM": "7/3/2014 8:03:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Omeprazole",
        "ORDER_MNEMONIC": "OMEPRAZOLE 20 MG PO CPDR"
      },
      {
        "INDEX": 217861,
        "PAT_ID": 20753417,
        "VISIT_NO": 198939715,
        "ORDER_DTM": "7/3/2014 10:09:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DiltiaZEM HCl",
        "ORDER_MNEMONIC": "DILTIAZEM HCL ER 120 MG PO CP24"
      },
      {
        "INDEX": 217862,
        "PAT_ID": 20753417,
        "VISIT_NO": 198939715,
        "ORDER_DTM": "7/3/2014 10:46:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "GABAPENTIN",
        "ORDER_MNEMONIC": "GABAPENTIN 600 MG PO TABS"
      },
      {
        "INDEX": 217863,
        "PAT_ID": 20753417,
        "VISIT_NO": 198939715,
        "ORDER_DTM": "7/3/2014 10:09:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SPIRONOLACTONE",
        "ORDER_MNEMONIC": "SPIRONOLACTONE 25 MG PO TABS"
      },
      {
        "INDEX": 217864,
        "PAT_ID": 20753417,
        "VISIT_NO": 198939715,
        "ORDER_DTM": "7/3/2014 8:03:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Levothyroxine Sodium",
        "ORDER_MNEMONIC": "LEVOTHYROXINE SODIUM 50 MCG PO CAPS"
      },
      {
        "INDEX": 217865,
        "PAT_ID": 20753417,
        "VISIT_NO": 198939715,
        "ORDER_DTM": "7/3/2014 8:03:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Cyanocobalamin",
        "ORDER_MNEMONIC": "B-12 1000 MCG PO CAPS"
      },
      {
        "INDEX": 217866,
        "PAT_ID": 20753417,
        "VISIT_NO": 199284412,
        "ORDER_DTM": "7/31/2014 6:59:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "GADOBENATE DIMEGLUMINE",
        "ORDER_MNEMONIC": "GADOBENATE DIMEGLUMINE 529 MG/ML IV SOLN"
      },
      {
        "INDEX": 217867,
        "PAT_ID": 20753417,
        "VISIT_NO": 199742370,
        "ORDER_DTM": "10/6/2014 9:59:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRAZODONE HCL",
        "ORDER_MNEMONIC": "TRAZODONE HCL 50 MG PO TABS"
      },
      {
        "INDEX": 217868,
        "PAT_ID": 20753417,
        "VISIT_NO": 202932955,
        "ORDER_DTM": "2/5/2015 10:39:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PREGABALIN",
        "ORDER_MNEMONIC": "PREGABALIN 50 MG PO CAPS"
      },
      {
        "INDEX": 217869,
        "PAT_ID": 20753417,
        "VISIT_NO": 204505943,
        "ORDER_DTM": "6/9/2015 9:30:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "MISC MEDICATION (SEE SIG DETAILS)"
      },
      {
        "INDEX": 217870,
        "PAT_ID": 20753417,
        "VISIT_NO": 204540904,
        "ORDER_DTM": "4/13/2015 10:26:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "KETOROLAC TROMETHAMINE",
        "ORDER_MNEMONIC": "KETOROLAC TROMETHAMINE 60 MG/2ML IM SOLN"
      },
      {
        "INDEX": 217871,
        "PAT_ID": 20753417,
        "VISIT_NO": 204552202,
        "ORDER_DTM": "4/13/2015 1:06:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "KETOROLAC TROMETHAMINE",
        "ORDER_MNEMONIC": "KETOROLAC TROMETHAMINE 60 MG/2ML IM SOLN"
      },
      {
        "INDEX": 217872,
        "PAT_ID": 20753417,
        "VISIT_NO": 205716100,
        "ORDER_DTM": "10/20/2015 9:44:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 217873,
        "PAT_ID": 20753417,
        "VISIT_NO": 205716100,
        "ORDER_DTM": "10/20/2015 9:44:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "KETOROLAC TROMETHAMINE",
        "ORDER_MNEMONIC": "KETOROLAC TROMETHAMINE 60 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 217874,
        "PAT_ID": 20753417,
        "VISIT_NO": 205716100,
        "ORDER_DTM": "10/20/2015 9:44:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TiZANidine HCl",
        "ORDER_MNEMONIC": "TIZANIDINE HCL 2 MG PO TABS"
      },
      {
        "INDEX": 217875,
        "PAT_ID": 20753417,
        "VISIT_NO": 207168514,
        "ORDER_DTM": "12/8/2015 10:43:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TOPIRAMATE",
        "ORDER_MNEMONIC": "TOPIRAMATE 200 MG PO TABS"
      },
      {
        "INDEX": 217876,
        "PAT_ID": 20753417,
        "VISIT_NO": 207168514,
        "ORDER_DTM": "12/8/2015 11:03:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 217877,
        "PAT_ID": 20753417,
        "VISIT_NO": 207385236,
        "ORDER_DTM": "9/4/2015 12:34:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Gabapentin",
        "ORDER_MNEMONIC": "GABAPENTIN 300 MG PO CAPS"
      },
      {
        "INDEX": 217878,
        "PAT_ID": 20753417,
        "VISIT_NO": 208774071,
        "ORDER_DTM": "11/12/2015 9:16:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PREGABALIN",
        "ORDER_MNEMONIC": "LYRICA 50 MG PO CAPS"
      },
      {
        "INDEX": 217879,
        "PAT_ID": 20753417,
        "VISIT_NO": 209351650,
        "ORDER_DTM": "4/5/2016 10:31:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "KETOROLAC TROMETHAMINE",
        "ORDER_MNEMONIC": "KETOROLAC TROMETHAMINE 60 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 217880,
        "PAT_ID": 20753417,
        "VISIT_NO": 209351650,
        "ORDER_DTM": "4/5/2016 10:31:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DEXAMETHASONE SODIUM PHOSPHATE",
        "ORDER_MNEMONIC": "DEXAMETHASONE SODIUM PHOSPHATE 4 MG/ML IJ SOLN"
      },
      {
        "INDEX": 217881,
        "PAT_ID": 20753417,
        "VISIT_NO": 210858098,
        "ORDER_DTM": "2/23/2016 11:22:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Gabapentin",
        "ORDER_MNEMONIC": "GABAPENTIN 300 MG PO CAPS"
      },
      {
        "INDEX": 217882,
        "PAT_ID": 20753417,
        "VISIT_NO": 211121149,
        "ORDER_DTM": "4/5/2016 1:56:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Multiple Vitamins-Minerals",
        "ORDER_MNEMONIC": "CENTRUM SILVER PO"
      },
      {
        "INDEX": 217883,
        "PAT_ID": 20753417,
        "VISIT_NO": 211121149,
        "ORDER_DTM": "4/5/2016 1:56:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Oxybutynin Chloride",
        "ORDER_MNEMONIC": "OXYBUTYNIN CHLORIDE ER 15 MG PO TB24"
      },
      {
        "INDEX": 217917,
        "PAT_ID": 20753417,
        "VISIT_NO": 0,
        "ORDER_DTM": "3/7/2016",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "HLTH&BEHAVIOR ASSMT EA 15 MIN W/PT 1ST ASSMT",
        "ORDER_MNEMONIC": "HEAL & BEHAV ASSESS,EA 15 MIN,INIT"
      },
      {
        "INDEX": 217918,
        "PAT_ID": 20753417,
        "VISIT_NO": 0,
        "ORDER_DTM": "3/7/2016",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "HLTH&BEHAVIOR ASSMT EA 15 MIN W/PT RE-ASSMT",
        "ORDER_MNEMONIC": "HEAL & BEHAV ASSESS,EA 15 MIN,RE-ASSESS"
      },
      {
        "INDEX": 217919,
        "PAT_ID": 20753417,
        "VISIT_NO": 198939715,
        "ORDER_DTM": "7/3/2014 8:03:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TIZANIDINE HCL",
        "ORDER_MNEMONIC": "TIZANIDINE HCL 4 MG PO TABS"
      },
      {
        "INDEX": 217920,
        "PAT_ID": 20753417,
        "VISIT_NO": 198939715,
        "ORDER_DTM": "7/3/2014 8:03:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "GABAPENTIN",
        "ORDER_MNEMONIC": "GABAPENTIN 400 MG PO CAPS"
      },
      {
        "INDEX": 217921,
        "PAT_ID": 20753417,
        "VISIT_NO": 198939715,
        "ORDER_DTM": "7/3/2014 8:03:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MORPHINE SULFATE",
        "ORDER_MNEMONIC": "MORPHINE SULFATE 30 MG PO TABS"
      },
      {
        "INDEX": 217922,
        "PAT_ID": 20753417,
        "VISIT_NO": 198939715,
        "ORDER_DTM": "7/3/2014 8:03:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Omega-3 Fatty Acids",
        "ORDER_MNEMONIC": "FISH OIL PO"
      },
      {
        "INDEX": 217923,
        "PAT_ID": 20753417,
        "VISIT_NO": 198939715,
        "ORDER_DTM": "7/3/2014 8:03:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Pravastatin Sodium",
        "ORDER_MNEMONIC": "PRAVASTATIN SODIUM 40 MG PO TABLET"
      },
      {
        "INDEX": 217924,
        "PAT_ID": 20753417,
        "VISIT_NO": 198939715,
        "ORDER_DTM": "7/3/2014 10:09:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DULOXETINE HCL",
        "ORDER_MNEMONIC": "DULOXETINE HCL 60 MG PO CPEP"
      },
      {
        "INDEX": 217925,
        "PAT_ID": 20753417,
        "VISIT_NO": 198939715,
        "ORDER_DTM": "7/3/2014 8:03:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TOPIRAMATE",
        "ORDER_MNEMONIC": "TOPIRAMATE 200 MG PO TABS"
      },
      {
        "INDEX": 217926,
        "PAT_ID": 20753417,
        "VISIT_NO": 198939715,
        "ORDER_DTM": "7/3/2014 10:09:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DULOXETINE HCL",
        "ORDER_MNEMONIC": "DULOXETINE HCL 30 MG PO CPEP"
      },
      {
        "INDEX": 217927,
        "PAT_ID": 20753417,
        "VISIT_NO": 198939715,
        "ORDER_DTM": "7/3/2014 10:43:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "NDL EMG 1 XTR W/WO RELATED PARASPINAL AREAS",
        "ORDER_MNEMONIC": "EMG, NEEDLE, ONE LIMB"
      },
      {
        "INDEX": 217928,
        "PAT_ID": 20753417,
        "VISIT_NO": 198939715,
        "ORDER_DTM": "7/3/2014 8:03:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Aspirin",
        "ORDER_MNEMONIC": "ASPIRIN 81 MG PO TABLET"
      },
      {
        "INDEX": 217929,
        "PAT_ID": 20753417,
        "VISIT_NO": 198939715,
        "ORDER_DTM": "7/3/2014 8:03:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Calcium Carbonate-Vitamin D",
        "ORDER_MNEMONIC": "CALCIUM CARBONATE-VITAMIN D 600-400 MG-UNIT PO TABLET"
      },
      {
        "INDEX": 217930,
        "PAT_ID": 20753417,
        "VISIT_NO": 198939715,
        "ORDER_DTM": "7/3/2014 8:03:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ARMODAFINIL",
        "ORDER_MNEMONIC": "ARMODAFINIL 250 MG PO TABS"
      },
      {
        "INDEX": 217931,
        "PAT_ID": 20753417,
        "VISIT_NO": 198939715,
        "ORDER_DTM": "7/3/2014 8:03:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MELOXICAM",
        "ORDER_MNEMONIC": "MELOXICAM 15 MG PO TABS"
      },
      {
        "INDEX": 217932,
        "PAT_ID": 20753417,
        "VISIT_NO": 199284360,
        "ORDER_DTM": "8/1/2014 11:25:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MELOXICAM",
        "ORDER_MNEMONIC": "MELOXICAM 15 MG PO TABS"
      },
      {
        "INDEX": 217933,
        "PAT_ID": 20753417,
        "VISIT_NO": 199742370,
        "ORDER_DTM": "10/6/2014 10:02:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "KETOROLAC TROMETHAMINE",
        "ORDER_MNEMONIC": "KETOROLAC TROMETHAMINE 60 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 217934,
        "PAT_ID": 20753417,
        "VISIT_NO": 199742370,
        "ORDER_DTM": "10/6/2014 10:02:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LORAZEPAM",
        "ORDER_MNEMONIC": "LORAZEPAM 2 MG/ML IJ SOLN"
      },
      {
        "INDEX": 217935,
        "PAT_ID": 20753417,
        "VISIT_NO": 201556980,
        "ORDER_DTM": "12/12/2014 9:23:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "KETOROLAC TROMETHAMINE",
        "ORDER_MNEMONIC": "KETOROLAC TROMETHAMINE 60 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 217936,
        "PAT_ID": 20753417,
        "VISIT_NO": 202932955,
        "ORDER_DTM": "2/5/2015 11:46:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "KETOROLAC TROMETHAMINE",
        "ORDER_MNEMONIC": "KETOROLAC TROMETHAMINE 60 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 217937,
        "PAT_ID": 20753417,
        "VISIT_NO": 203213266,
        "ORDER_DTM": "4/7/2015 9:32:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "KETOROLAC TROMETHAMINE",
        "ORDER_MNEMONIC": "KETOROLAC TROMETHAMINE 60 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 217938,
        "PAT_ID": 20753417,
        "VISIT_NO": 203877308,
        "ORDER_DTM": "3/19/2015 10:19:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "GABAPENTIN",
        "ORDER_MNEMONIC": "GABAPENTIN 300 MG PO CAPS"
      },
      {
        "INDEX": 217939,
        "PAT_ID": 20753417,
        "VISIT_NO": 204505943,
        "ORDER_DTM": "6/9/2015 9:23:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "KETOROLAC TROMETHAMINE",
        "ORDER_MNEMONIC": "KETOROLAC TROMETHAMINE 60 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 217940,
        "PAT_ID": 20753417,
        "VISIT_NO": 205716017,
        "ORDER_DTM": "8/25/2015 12:58:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 217941,
        "PAT_ID": 20753417,
        "VISIT_NO": 205716017,
        "ORDER_DTM": "8/25/2015 12:58:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "KETOROLAC TROMETHAMINE",
        "ORDER_MNEMONIC": "KETOROLAC TROMETHAMINE 60 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 217942,
        "PAT_ID": 20753417,
        "VISIT_NO": 205716100,
        "ORDER_DTM": "10/20/2015 9:19:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYBUTYNIN CHLORIDE",
        "ORDER_MNEMONIC": "OXYBUTYNIN CHLORIDE ER 5 MG PO TB24"
      },
      {
        "INDEX": 217943,
        "PAT_ID": 20753417,
        "VISIT_NO": 206860896,
        "ORDER_DTM": "8/11/2015 9:42:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "GABAPENTIN",
        "ORDER_MNEMONIC": "GABAPENTIN 300 MG PO CAPS"
      },
      {
        "INDEX": 217944,
        "PAT_ID": 20753417,
        "VISIT_NO": 206994892,
        "ORDER_DTM": "8/20/2015 3:02:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PREGABALIN",
        "ORDER_MNEMONIC": "LYRICA 50 MG PO CAPS"
      },
      {
        "INDEX": 217945,
        "PAT_ID": 20753417,
        "VISIT_NO": 207168514,
        "ORDER_DTM": "12/8/2015 10:43:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Spironolactone",
        "ORDER_MNEMONIC": "SPIRONOLACTONE 25 MG PO TABLET"
      },
      {
        "INDEX": 217946,
        "PAT_ID": 20753417,
        "VISIT_NO": 207168514,
        "ORDER_DTM": "12/8/2015 11:03:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "KETOROLAC TROMETHAMINE",
        "ORDER_MNEMONIC": "KETOROLAC TROMETHAMINE 60 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 217947,
        "PAT_ID": 20753417,
        "VISIT_NO": 207168566,
        "ORDER_DTM": "2/9/2016 10:52:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "KETOROLAC TROMETHAMINE",
        "ORDER_MNEMONIC": "KETOROLAC TROMETHAMINE 60 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 217948,
        "PAT_ID": 20753417,
        "VISIT_NO": 209351650,
        "ORDER_DTM": "4/5/2016 10:14:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Mirabegron",
        "ORDER_MNEMONIC": "MIRABEGRON ER 50 MG PO TB24"
      },
      {
        "INDEX": 217949,
        "PAT_ID": 20753417,
        "VISIT_NO": 209351650,
        "ORDER_DTM": "4/5/2016 10:31:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 217950,
        "PAT_ID": 20753417,
        "VISIT_NO": 210586213,
        "ORDER_DTM": "8/9/2016 9:28:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DULoxetine HCl",
        "ORDER_MNEMONIC": "DULOXETINE HCL 60 MG PO CPEP"
      },
      {
        "INDEX": 217951,
        "PAT_ID": 20753417,
        "VISIT_NO": 211121149,
        "ORDER_DTM": "4/5/2016 1:56:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Torsemide",
        "ORDER_MNEMONIC": "TORSEMIDE 20 MG PO TABLET"
      },
      {
        "INDEX": 217952,
        "PAT_ID": 20753417,
        "VISIT_NO": 211121149,
        "ORDER_DTM": "4/5/2016 1:56:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LORATADINE",
        "ORDER_MNEMONIC": "LORATADINE 10 MG PO TABS"
      },
      {
        "INDEX": 217953,
        "PAT_ID": 20753417,
        "VISIT_NO": 211121173,
        "ORDER_DTM": "4/6/2016 11:56:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PHYSICAL THERAPY EVALUATION",
        "ORDER_MNEMONIC": "PHYS THERAPY EVALUATION"
      },
      {
        "INDEX": 217954,
        "PAT_ID": 20753417,
        "VISIT_NO": 212010204,
        "ORDER_DTM": "6/21/2016 10:30:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DULOXETINE HCL",
        "ORDER_MNEMONIC": "DULOXETINE HCL 60 MG PO CPEP"
      },
      {
        "INDEX": 217955,
        "PAT_ID": 20753417,
        "VISIT_NO": 212010204,
        "ORDER_DTM": "6/21/2016 10:06:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "KETOROLAC TROMETHAMINE",
        "ORDER_MNEMONIC": "KETOROLAC TROMETHAMINE 60 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 217956,
        "PAT_ID": 20753417,
        "VISIT_NO": 215657338,
        "ORDER_DTM": "9/23/2016 2:58:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Pregabalin",
        "ORDER_MNEMONIC": "LYRICA 50 MG PO CAPS"
      },
      {
        "INDEX": 217957,
        "PAT_ID": 20753417,
        "VISIT_NO": 215808889,
        "ORDER_DTM": "10/20/2016 10:37:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Lidocaine",
        "ORDER_MNEMONIC": "LIDOCAINE 5 % EX OINT"
      },
      {
        "INDEX": 217977,
        "PAT_ID": 20753417,
        "VISIT_NO": 211121149,
        "ORDER_DTM": "4/5/2016 1:56:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Magnesium Oxide",
        "ORDER_MNEMONIC": "MAGNESIUM OXIDE 400 MG PO CAPS"
      },
      {
        "INDEX": 217978,
        "PAT_ID": 20753417,
        "VISIT_NO": 211121198,
        "ORDER_DTM": "4/5/2016 4:17:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "HLTH&BEHAVIOR ASSMT EA 15 MIN W/PT 1ST ASSMT",
        "ORDER_MNEMONIC": "HEAL & BEHAV ASSESS,EA 15 MIN,INIT"
      },
      {
        "INDEX": 217979,
        "PAT_ID": 20753417,
        "VISIT_NO": 211656841,
        "ORDER_DTM": "4/1/2016 2:10:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Pregabalin",
        "ORDER_MNEMONIC": "LYRICA 50 MG PO CAPS"
      },
      {
        "INDEX": 217980,
        "PAT_ID": 20753417,
        "VISIT_NO": 212010204,
        "ORDER_DTM": "6/21/2016 10:30:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DULOXETINE HCL",
        "ORDER_MNEMONIC": "DULOXETINE HCL 30 MG PO CPEP"
      },
      {
        "INDEX": 217981,
        "PAT_ID": 20753417,
        "VISIT_NO": 212010204,
        "ORDER_DTM": "6/21/2016 10:06:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 217982,
        "PAT_ID": 20753417,
        "VISIT_NO": 215808889,
        "ORDER_DTM": "10/20/2016 10:17:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FentaNYL",
        "ORDER_MNEMONIC": "FENTANYL 75 MCG/HR TD PT72"
      },
      {
        "INDEX": 217983,
        "PAT_ID": 20753417,
        "VISIT_NO": 216525969,
        "ORDER_DTM": "11/1/2016 9:16:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Pregabalin",
        "ORDER_MNEMONIC": "LYRICA 50 MG PO CAPS"
      },
      {
        "INDEX": 217984,
        "PAT_ID": 20753417,
        "VISIT_NO": 219355251,
        "ORDER_DTM": "3/6/2017 1:28:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Gabapentin",
        "ORDER_MNEMONIC": "GABAPENTIN 300 MG PO CAPS"
      }
    ],
    3437159: [
      {
        "INDEX": 546071,
        "PAT_ID": 3437159,
        "VISIT_NO": 195716458,
        "ORDER_DTM": "11/18/2013 12:21:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Multiple Vitamins-Minerals",
        "ORDER_MNEMONIC": "WOMENS MULTI PO"
      },
      {
        "INDEX": 546072,
        "PAT_ID": 3437159,
        "VISIT_NO": 196217580,
        "ORDER_DTM": "12/20/2013 3:05:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DIAZEPAM",
        "ORDER_MNEMONIC": "DIAZEPAM 2 MG PO TABS"
      },
      {
        "INDEX": 546073,
        "PAT_ID": 3437159,
        "VISIT_NO": 196321403,
        "ORDER_DTM": "12/23/2013 3:27:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRAMADOL HCL",
        "ORDER_MNEMONIC": "TRAMADOL HCL 50 MG PO TABS"
      },
      {
        "INDEX": 546074,
        "PAT_ID": 3437159,
        "VISIT_NO": 196361245,
        "ORDER_DTM": "12/31/2013 11:56:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DIAZEPAM",
        "ORDER_MNEMONIC": "DIAZEPAM 2 MG PO TABS"
      },
      {
        "INDEX": 546075,
        "PAT_ID": 3437159,
        "VISIT_NO": 196388254,
        "ORDER_DTM": "1/6/2014 11:07:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRAMADOL HCL",
        "ORDER_MNEMONIC": "TRAMADOL HCL"
      },
      {
        "INDEX": 546076,
        "PAT_ID": 3437159,
        "VISIT_NO": 196388254,
        "ORDER_DTM": "1/6/2014 11:19:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PREDNISONE",
        "ORDER_MNEMONIC": "PREDNISONE 20 MG PO TABS"
      },
      {
        "INDEX": 546077,
        "PAT_ID": 3437159,
        "VISIT_NO": 196587110,
        "ORDER_DTM": "1/14/2014 5:29:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRAMADOL HCL",
        "ORDER_MNEMONIC": "TRAMADOL HCL 50 MG PO TABS"
      },
      {
        "INDEX": 546078,
        "PAT_ID": 3437159,
        "VISIT_NO": 197530283,
        "ORDER_DTM": "4/7/2014 1:55:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRAMADOL HCL",
        "ORDER_MNEMONIC": "TRAMADOL HCL 50 MG PO TABS"
      },
      {
        "INDEX": 546079,
        "PAT_ID": 3437159,
        "VISIT_NO": 199150137,
        "ORDER_DTM": "6/25/2014 4:52:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OMEPRAZOLE",
        "ORDER_MNEMONIC": "OMEPRAZOLE 20 MG PO CPDR"
      },
      {
        "INDEX": 546080,
        "PAT_ID": 3437159,
        "VISIT_NO": 200720672,
        "ORDER_DTM": "12/8/2014 6:54:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRAMADOL HCL",
        "ORDER_MNEMONIC": "TRAMADOL HCL 50 MG PO TABS"
      },
      {
        "INDEX": 546081,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/15/2015 7:02:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Ibuprofen",
        "ORDER_MNEMONIC": "IBUPROFEN 800 MG PO TABLET"
      },
      {
        "INDEX": 546082,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/15/2015 7:02:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Aspirin",
        "ORDER_MNEMONIC": "ASPIRIN EC 81 MG PO TBEC"
      },
      {
        "INDEX": 546083,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 8:15:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG PO TABS"
      },
      {
        "INDEX": 546084,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 12:03:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LACTATED RINGERS",
        "ORDER_MNEMONIC": "LACTATED RINGERS IV SOLN"
      },
      {
        "INDEX": 546085,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 7:33:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "KCL IN DEXTROSE-NACL",
        "ORDER_MNEMONIC": "KCL IN DEXTROSE-NACL 20-5-0.45 MEQ/L-%-% IV SOLN"
      },
      {
        "INDEX": 546086,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 6:53:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DIPHENHYDRAMINE HCL",
        "ORDER_MNEMONIC": "DIPHENHYDRAMINE HCL 50 MG/ML IJ SOLN"
      },
      {
        "INDEX": 546087,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 4:06:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LIDOCAINE-EPINEPHRINE",
        "ORDER_MNEMONIC": "LIDOCAINE-EPINEPHRINE 1 %-1:100000 IJ SOLN"
      },
      {
        "INDEX": 546088,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 8:15:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DOCUSATE SODIUM",
        "ORDER_MNEMONIC": "DOCUSATE SODIUM 100 MG PO CAPS"
      },
      {
        "INDEX": 546089,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 6:53:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ALBUTEROL SULFATE",
        "ORDER_MNEMONIC": "ALBUTEROL SULFATE (5 MG/ML) 0.5% IN NEBU"
      },
      {
        "INDEX": 546090,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 6:53:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FENTANYL CITRATE",
        "ORDER_MNEMONIC": "FENTANYL CITRATE 0.05 MG/ML IJ SOLN"
      },
      {
        "INDEX": 546091,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 8:16:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OMEPRAZOLE",
        "ORDER_MNEMONIC": "OMEPRAZOLE 40 MG PO CPDR"
      },
      {
        "INDEX": 546092,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 8:15:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SENNOSIDES",
        "ORDER_MNEMONIC": "SENNA 8.6 MG PO TABS"
      },
      {
        "INDEX": 546093,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 6:53:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDRALAZINE HCL",
        "ORDER_MNEMONIC": "HYDRALAZINE HCL 20 MG/ML IJ SOLN"
      },
      {
        "INDEX": 546094,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 6:53:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 546095,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 6:53:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PROMETHAZINE HCL",
        "ORDER_MNEMONIC": "PROMETHAZINE HCL 25 MG/ML IJ SOLN"
      },
      {
        "INDEX": 546096,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 8:16:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CITALOPRAM HYDROBROMIDE",
        "ORDER_MNEMONIC": "CITALOPRAM HYDROBROMIDE 20 MG PO TABS"
      },
      {
        "INDEX": 546097,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 6:53:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LACTATED RINGERS",
        "ORDER_MNEMONIC": "LACTATED RINGERS IV SOLN"
      },
      {
        "INDEX": 546098,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 8:16:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BUPROPION HCL",
        "ORDER_MNEMONIC": "BUPROPION HCL 100 MG PO TABS"
      },
      {
        "INDEX": 546099,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/20/2015 4:47:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN",
        "ORDER_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN 5-325 MG PO TABS"
      },
      {
        "INDEX": 546100,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/20/2015 12:32:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LEVOTHYROXINE SODIUM",
        "ORDER_MNEMONIC": "LEVOTHYROXINE SODIUM 137 MCG PO TABS"
      },
      {
        "INDEX": 546101,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 6:58:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CALCIUM CARBONATE ANTACID",
        "ORDER_MNEMONIC": "CALCIUM CARBONATE ANTACID 500 MG PO CHEW"
      },
      {
        "INDEX": 546102,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/20/2015 3:19:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Omega-3 Fatty Acids",
        "ORDER_MNEMONIC": "FISH OIL 1000 MG PO CAPS"
      },
      {
        "INDEX": 546103,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/20/2015 3:19:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Ginkgo Biloba",
        "ORDER_MNEMONIC": "GINKGO BILOBA 100 MG PO CAPS"
      },
      {
        "INDEX": 546104,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/20/2015 12:32:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DOCUSATE SODIUM",
        "ORDER_MNEMONIC": "DSS 100 MG PO CAPS"
      },
      {
        "INDEX": 546155,
        "PAT_ID": 3437159,
        "VISIT_NO": 195716458,
        "ORDER_DTM": "11/18/2013 12:21:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Ascorbic Acid",
        "ORDER_MNEMONIC": "VITAMIN C 1000 MG PO TABLET"
      },
      {
        "INDEX": 546156,
        "PAT_ID": 3437159,
        "VISIT_NO": 195968642,
        "ORDER_DTM": "11/26/2013 2:10:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "IBUPROFEN",
        "ORDER_MNEMONIC": "IBUPROFEN"
      },
      {
        "INDEX": 546157,
        "PAT_ID": 3437159,
        "VISIT_NO": 196217580,
        "ORDER_DTM": "12/20/2013 3:05:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PREDNISONE",
        "ORDER_MNEMONIC": "PREDNISONE 20 MG PO TABS"
      },
      {
        "INDEX": 546158,
        "PAT_ID": 3437159,
        "VISIT_NO": 196569050,
        "ORDER_DTM": "1/13/2014 5:00:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DIAZEPAM",
        "ORDER_MNEMONIC": "DIAZEPAM 2 MG PO TABS"
      },
      {
        "INDEX": 546159,
        "PAT_ID": 3437159,
        "VISIT_NO": 200720672,
        "ORDER_DTM": "12/8/2014 6:54:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OMEPRAZOLE",
        "ORDER_MNEMONIC": "OMEPRAZOLE 20 MG PO CPDR"
      },
      {
        "INDEX": 546160,
        "PAT_ID": 3437159,
        "VISIT_NO": 203815492,
        "ORDER_DTM": "3/18/2015 12:30:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SODIUM IODIDE I-123",
        "ORDER_MNEMONIC": "SODIUM IODIDE I-123 7.4 MBQ PO CAPS"
      },
      {
        "INDEX": 546161,
        "PAT_ID": 3437159,
        "VISIT_NO": 204074882,
        "ORDER_DTM": "3/27/2015 10:16:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METOPROLOL SUCCINATE",
        "ORDER_MNEMONIC": "METOPROLOL SUCCINATE ER 25 MG PO TB24"
      },
      {
        "INDEX": 546162,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 6:53:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROMORPHONE HCL",
        "ORDER_MNEMONIC": "HYDROMORPHONE HCL PF 1 MG/ML IJ SOLN"
      },
      {
        "INDEX": 546163,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/20/2015 12:32:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN",
        "ORDER_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN 5-325 MG PO TABS"
      },
      {
        "INDEX": 546164,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 8:15:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MAGNESIUM HYDROXIDE",
        "ORDER_MNEMONIC": "MAGNESIUM HYDROXIDE 400 MG/5ML PO SUSP"
      },
      {
        "INDEX": 546165,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 6:53:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LABETALOL HCL",
        "ORDER_MNEMONIC": "LABETALOL HCL 5 MG/ML IV SOLN"
      },
      {
        "INDEX": 546166,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 6:17:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXIDIZED CELLULOSE",
        "ORDER_MNEMONIC": "SURGICEL FIBRILLAR ABSORBABLE HEMOSTAT 2X4 IN"
      },
      {
        "INDEX": 546167,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 6:53:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HALOPERIDOL LACTATE",
        "ORDER_MNEMONIC": "HALOPERIDOL LACTATE 5 MG/ML IJ SOLN"
      },
      {
        "INDEX": 546168,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 8:15:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PROMETHAZINE HCL",
        "ORDER_MNEMONIC": "PROMETHAZINE HCL 12.5 MG PO TABS"
      },
      {
        "INDEX": 546169,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 8:15:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 546170,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 8:16:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METOPROLOL SUCCINATE",
        "ORDER_MNEMONIC": "METOPROLOL SUCCINATE ER 25 MG PO TB24"
      },
      {
        "INDEX": 546171,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 6:53:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MEPERIDINE HCL",
        "ORDER_MNEMONIC": "MEPERIDINE HCL 25 MG/ML IJ SOLN"
      },
      {
        "INDEX": 546172,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 8:15:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE-ACETAMINOPHEN",
        "ORDER_MNEMONIC": "OXYCODONE-ACETAMINOPHEN 5-325 MG PO TABS"
      },
      {
        "INDEX": 546173,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 8:15:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MORPHINE SULFATE",
        "ORDER_MNEMONIC": "MORPHINE SULFATE (PF) 4 MG/ML IV SOLN"
      },
      {
        "INDEX": 546174,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/20/2015 3:19:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "B Complex Vitamins",
        "ORDER_MNEMONIC": "VITAMIN B COMPLEX PO TABLET"
      },
      {
        "INDEX": 546175,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/20/2015 12:32:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Calcium Carbonate Antacid",
        "ORDER_MNEMONIC": "CALCIUM CARBONATE ANTACID 500 MG PO CHEW"
      },
      {
        "INDEX": 546176,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 3:59:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SUCCINYLCHOLINE CHLORIDE",
        "ORDER_MNEMONIC": "SUCCINYLCHOLINE CHLORIDE 20 MG/ML IJ SOLN"
      },
      {
        "INDEX": 546177,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 3:59:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FENTANYL CITRATE",
        "ORDER_MNEMONIC": "FENTANYL CITRATE 0.05 MG/ML IJ SOLN"
      },
      {
        "INDEX": 546178,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 3:59:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LIDOCAINE HCL",
        "ORDER_MNEMONIC": "LIDOCAINE HCL 4 % IJ SOLN"
      },
      {
        "INDEX": 546179,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 4:17:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "EPHEDRINE SULFATE (PRESSORS)",
        "ORDER_MNEMONIC": "EPHEDRINE SULFATE 50 MG/ML IJ SOLN"
      },
      {
        "INDEX": 546180,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 3:59:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "LACTATED RINGERS IV BOLUS"
      },
      {
        "INDEX": 546181,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 3:59:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DEXAMETHASONE SODIUM PHOSPHATE",
        "ORDER_MNEMONIC": "DEXAMETHASONE SOD PHOSPHATE PF 10 MG/ML IJ SOLN"
      },
      {
        "INDEX": 546182,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 3:59:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PROPOFOL",
        "ORDER_MNEMONIC": "PROPOFOL 10 MG/ML IV EMUL"
      },
      {
        "INDEX": 546183,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 3:59:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "PROPOFOL W/REMIFENTANIL INFUSION OP-TIME"
      },
      {
        "INDEX": 546184,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 6:25:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 546185,
        "PAT_ID": 3437159,
        "VISIT_NO": 207059155,
        "ORDER_DTM": "8/20/2015 6:47:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LEVOTHYROXINE SODIUM",
        "ORDER_MNEMONIC": "LEVOTHYROXINE SODIUM 125 MCG PO TABS"
      },
      {
        "INDEX": 546186,
        "PAT_ID": 3437159,
        "VISIT_NO": 209786940,
        "ORDER_DTM": "1/4/2016 1:31:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OMEPRAZOLE",
        "ORDER_MNEMONIC": "OMEPRAZOLE 20 MG PO CPDR"
      },
      {
        "INDEX": 546187,
        "PAT_ID": 3437159,
        "VISIT_NO": 212413716,
        "ORDER_DTM": "5/2/2016 11:59:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Omeprazole",
        "ORDER_MNEMONIC": "OMEPRAZOLE 20 MG PO CPDR"
      },
      {
        "INDEX": 546188,
        "PAT_ID": 3437159,
        "VISIT_NO": 218323300,
        "ORDER_DTM": "1/23/2017 12:34:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Omeprazole",
        "ORDER_MNEMONIC": "OMEPRAZOLE 20 MG PO CPDR"
      },
      {
        "INDEX": 546189,
        "PAT_ID": 3437159,
        "VISIT_NO": 218323300,
        "ORDER_DTM": "1/23/2017 12:34:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BuPROPion HCl",
        "ORDER_MNEMONIC": "BUPROPION HCL 100 MG PO TABLET"
      },
      {
        "INDEX": 546190,
        "PAT_ID": 3437159,
        "VISIT_NO": 218323300,
        "ORDER_DTM": "1/23/2017 12:34:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Citalopram Hydrobromide",
        "ORDER_MNEMONIC": "CITALOPRAM HYDROBROMIDE 20 MG PO TABLET"
      },
      {
        "INDEX": 546191,
        "PAT_ID": 3437159,
        "VISIT_NO": 218372233,
        "ORDER_DTM": "1/24/2017 5:28:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Metoprolol Succinate",
        "ORDER_MNEMONIC": "METOPROLOL SUCCINATE ER 25 MG PO TB24"
      },
      {
        "INDEX": 546192,
        "PAT_ID": 3437159,
        "VISIT_NO": 219509329,
        "ORDER_DTM": "3/13/2017 5:20:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Omeprazole",
        "ORDER_MNEMONIC": "OMEPRAZOLE 20 MG PO CPDR"
      },
      {
        "INDEX": 546293,
        "PAT_ID": 3437159,
        "VISIT_NO": 205195093,
        "ORDER_DTM": "5/19/2015 3:58:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "AIRWAY"
      },
      {
        "INDEX": 546294,
        "PAT_ID": 3437159,
        "VISIT_NO": 210385155,
        "ORDER_DTM": "2/1/2016 4:44:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Metoprolol Succinate",
        "ORDER_MNEMONIC": "METOPROLOL SUCCINATE ER 25 MG PO TB24"
      },
      {
        "INDEX": 546295,
        "PAT_ID": 3437159,
        "VISIT_NO": 212372163,
        "ORDER_DTM": "4/28/2016 9:29:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Levothyroxine Sodium",
        "ORDER_MNEMONIC": "LEVOTHYROXINE SODIUM 125 MCG PO TABLET"
      },
      {
        "INDEX": 546296,
        "PAT_ID": 3437159,
        "VISIT_NO": 216507112,
        "ORDER_DTM": "11/1/2016 7:57:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Levothyroxine Sodium",
        "ORDER_MNEMONIC": "LEVOTHYROXINE SODIUM 125 MCG PO TABLET"
      },
      {
        "INDEX": 546297,
        "PAT_ID": 3437159,
        "VISIT_NO": 216538596,
        "ORDER_DTM": "11/1/2016 2:19:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Omeprazole",
        "ORDER_MNEMONIC": "OMEPRAZOLE 20 MG PO CPDR"
      },
      {
        "INDEX": 546298,
        "PAT_ID": 3437159,
        "VISIT_NO": 218323300,
        "ORDER_DTM": "1/23/2017 12:34:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Levothyroxine Sodium",
        "ORDER_MNEMONIC": "LEVOTHYROXINE SODIUM 125 MCG PO TABLET"
      },
      {
        "INDEX": 546299,
        "PAT_ID": 3437159,
        "VISIT_NO": 218323300,
        "ORDER_DTM": "1/23/2017 12:34:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Metoprolol Succinate",
        "ORDER_MNEMONIC": "METOPROLOL SUCCINATE ER 25 MG PO TB24"
      }
    ],
    20669353: [
      {
        "INDEX": 784665,
        "PAT_ID": 20669353,
        "VISIT_NO": 201067450,
        "ORDER_DTM": "10/13/2014 5:54:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ACETAMINOPHEN-CODEINE",
        "ORDER_MNEMONIC": "ACETAMINOPHEN-CODEINE #3 300-30 MG PO TABS"
      },
      {
        "INDEX": 784666,
        "PAT_ID": 20669353,
        "VISIT_NO": 201067450,
        "ORDER_DTM": "10/13/2014 5:54:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "NAPROXEN",
        "ORDER_MNEMONIC": "NAPROXEN 500 MG PO TABS"
      },
      {
        "INDEX": 784667,
        "PAT_ID": 20669353,
        "VISIT_NO": 201146817,
        "ORDER_DTM": "10/15/2014 11:04:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "12 LEAD ECG (EKG)",
        "ORDER_MNEMONIC": "12 LEAD ECG (EKG)"
      },
      {
        "INDEX": 784668,
        "PAT_ID": 20669353,
        "VISIT_NO": 201183997,
        "ORDER_DTM": "10/23/2014 2:56:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "VO2 PULMONARY UPTAKE ANALYSIS",
        "ORDER_MNEMONIC": "VO2 PULMONARY UPTAKE ANALYSIS"
      },
      {
        "INDEX": 784669,
        "PAT_ID": 20669353,
        "VISIT_NO": 202554375,
        "ORDER_DTM": "1/14/2015 9:13:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 784670,
        "PAT_ID": 20669353,
        "VISIT_NO": 202896746,
        "ORDER_DTM": "1/21/2015 1:57:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 784671,
        "PAT_ID": 20669353,
        "VISIT_NO": 204295145,
        "ORDER_DTM": "4/3/2015 10:41:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "NEOMYCIN-POLYMYXIN-DEXAMETH",
        "ORDER_MNEMONIC": "NEOMYCIN-POLYMYXIN-DEXAMETH 0.1 % OP SUSP"
      },
      {
        "INDEX": 784672,
        "PAT_ID": 20669353,
        "VISIT_NO": 218346952,
        "ORDER_DTM": "1/25/2017 2:54:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Norethin Ace-Eth Estrad-FE",
        "ORDER_MNEMONIC": "NORETHIN ACE-ETH ESTRAD-FE 1.5-30 MG-MCG PO TABLET"
      },
      {
        "INDEX": 784673,
        "PAT_ID": 20669353,
        "VISIT_NO": 218346952,
        "ORDER_DTM": "1/25/2017 2:54:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Nitrofurantoin Monohyd Macro",
        "ORDER_MNEMONIC": "NITROFURANTOIN MONOHYD MACRO 100 MG PO CAPS"
      },
      {
        "INDEX": 784906,
        "PAT_ID": 20669353,
        "VISIT_NO": 202268911,
        "ORDER_DTM": "1/2/2015 11:41:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PHYSICAL THERAPY EVALUATION",
        "ORDER_MNEMONIC": "PHYS THERAPY EVALUATION"
      },
      {
        "INDEX": 784907,
        "PAT_ID": 20669353,
        "VISIT_NO": 202268911,
        "ORDER_DTM": "1/2/2015 11:41:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 784908,
        "PAT_ID": 20669353,
        "VISIT_NO": 202554365,
        "ORDER_DTM": "1/7/2015 11:43:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      }
    ],
    20961066: [
      {
        "INDEX": 694259,
        "PAT_ID": 20961066,
        "VISIT_NO": 0,
        "ORDER_DTM": "9/8/2016",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "NJX ANES&/STRD W/IMG TFRML EDRL LMBR/SAC EA LV",
        "ORDER_MNEMONIC": "INJ,FORAMEN,L/S,ADDL LEVELS"
      },
      {
        "INDEX": 694260,
        "PAT_ID": 20961066,
        "VISIT_NO": 0,
        "ORDER_DTM": "1/19/2017",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "ARTHDSIS POST/POSTEROLATRL/POSTINTERBODY LUMBAR",
        "ORDER_MNEMONIC": "ARTHDSIS POST/POSTEROLATRL/POSTINTERBODY LUMBAR"
      },
      {
        "INDEX": 694261,
        "PAT_ID": 20961066,
        "VISIT_NO": 0,
        "ORDER_DTM": "1/19/2017",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "INSERT BIOMCHN DEV INTERVERTEBRAL DSC SPC W/ARTHRD"
      },
      {
        "INDEX": 694262,
        "PAT_ID": 20961066,
        "VISIT_NO": 0,
        "ORDER_DTM": "1/19/2017",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "LAM FACETECTOMY&FORAMTOMY 1 SGM EA CRV THRC/LMBR",
        "ORDER_MNEMONIC": "LAMINEC/FACETECT/FORAMIN,EACH ADDNL"
      },
      {
        "INDEX": 694263,
        "PAT_ID": 20961066,
        "VISIT_NO": 0,
        "ORDER_DTM": "1/19/2017",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "LAM FACETECTOMY & FORAMOTOMY 1 SEGMENT LUMBAR",
        "ORDER_MNEMONIC": "LAMINEC/FACETECT/FORAMIN,LUMBAR 1 SEG"
      },
      {
        "INDEX": 694264,
        "PAT_ID": 20961066,
        "VISIT_NO": 214639188,
        "ORDER_DTM": "8/9/2016 4:10:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LISINOPRIL",
        "ORDER_MNEMONIC": "LISINOPRIL 20 MG PO TABS"
      },
      {
        "INDEX": 694265,
        "PAT_ID": 20961066,
        "VISIT_NO": 214639188,
        "ORDER_DTM": "8/9/2016 3:59:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN",
        "ORDER_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN 5-325 MG PO TABS"
      },
      {
        "INDEX": 694266,
        "PAT_ID": 20961066,
        "VISIT_NO": 214639188,
        "ORDER_DTM": "8/9/2016 2:17:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LISINOPRIL",
        "ORDER_MNEMONIC": "LISINOPRIL 20 MG PO TABS"
      },
      {
        "INDEX": 694267,
        "PAT_ID": 20961066,
        "VISIT_NO": 214639188,
        "ORDER_DTM": "8/9/2016 3:09:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN",
        "ORDER_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN 5-325 MG PO TABS"
      },
      {
        "INDEX": 694268,
        "PAT_ID": 20961066,
        "VISIT_NO": 214639188,
        "ORDER_DTM": "8/9/2016 3:59:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Oxybutynin Chloride",
        "ORDER_MNEMONIC": "OXYBUTYNIN CHLORIDE 5 MG PO TABLET"
      },
      {
        "INDEX": 694269,
        "PAT_ID": 20961066,
        "VISIT_NO": 215080343,
        "ORDER_DTM": "8/28/2016 2:49:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Cyclobenzaprine HCl",
        "ORDER_MNEMONIC": "CYCLOBENZAPRINE HCL 5 MG PO TABLET"
      },
      {
        "INDEX": 694270,
        "PAT_ID": 20961066,
        "VISIT_NO": 215102698,
        "ORDER_DTM": "8/31/2016 4:20:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MethylPREDNISolone",
        "ORDER_MNEMONIC": "METHYLPREDNISOLONE 4 MG PO TBPK"
      },
      {
        "INDEX": 694271,
        "PAT_ID": 20961066,
        "VISIT_NO": 215102698,
        "ORDER_DTM": "8/31/2016 4:56:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DiazePAM",
        "ORDER_MNEMONIC": "DIAZEPAM 5 MG PO TABLET"
      },
      {
        "INDEX": 694272,
        "PAT_ID": 20961066,
        "VISIT_NO": 215305546,
        "ORDER_DTM": "9/23/2016 1:12:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Lisinopril-Hydrochlorothiazide",
        "ORDER_MNEMONIC": "LISINOPRIL-HYDROCHLOROTHIAZIDE 20-12.5 MG PO TABLET"
      },
      {
        "INDEX": 694273,
        "PAT_ID": 20961066,
        "VISIT_NO": 215305546,
        "ORDER_DTM": "9/23/2016 1:35:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Gabapentin",
        "ORDER_MNEMONIC": "GABAPENTIN 300 MG PO CAPS"
      },
      {
        "INDEX": 694274,
        "PAT_ID": 20961066,
        "VISIT_NO": 215317106,
        "ORDER_DTM": "9/8/2016 11:03:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Hydrocodone-Acetaminophen",
        "ORDER_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN 7.5-325 MG PO TABLET"
      },
      {
        "INDEX": 694349,
        "PAT_ID": 20961066,
        "VISIT_NO": 0,
        "ORDER_DTM": "9/8/2016",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "NJX ANES&/STRD W/IMG TFRML EDRL LMBR/SAC 1 LVL",
        "ORDER_MNEMONIC": "INJ,FORAMEN,L/S,1 LEVEL"
      },
      {
        "INDEX": 694350,
        "PAT_ID": 20961066,
        "VISIT_NO": 0,
        "ORDER_DTM": "1/19/2017",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "POSTERIOR NON-SEGMENTAL INSTRUMENTATION",
        "ORDER_MNEMONIC": "POSTERIOR NON-SEGMENTAL INSTRUMENTATION"
      },
      {
        "INDEX": 694351,
        "PAT_ID": 20961066,
        "VISIT_NO": 0,
        "ORDER_DTM": "1/19/2017",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "ALLOGRAFT FOR SPINE SURGERY ONLY STRUCTURAL",
        "ORDER_MNEMONIC": "ALLOGRAFT FOR SPINE SURGERY ONLY STRUCTURAL"
      },
      {
        "INDEX": 694352,
        "PAT_ID": 20961066,
        "VISIT_NO": 214639188,
        "ORDER_DTM": "8/9/2016 4:10:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRAZODONE HCL",
        "ORDER_MNEMONIC": "TRAZODONE HCL 100 MG PO TABS"
      },
      {
        "INDEX": 694353,
        "PAT_ID": 20961066,
        "VISIT_NO": 214639188,
        "ORDER_DTM": "8/9/2016 2:17:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRAZODONE HCL",
        "ORDER_MNEMONIC": "TRAZODONE HCL 100 MG PO TABS"
      },
      {
        "INDEX": 694354,
        "PAT_ID": 20961066,
        "VISIT_NO": 214639188,
        "ORDER_DTM": "8/9/2016 2:17:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROCHLOROTHIAZIDE",
        "ORDER_MNEMONIC": "HYDROCHLOROTHIAZIDE 25 MG PO TABLET"
      },
      {
        "INDEX": 694355,
        "PAT_ID": 20961066,
        "VISIT_NO": 214639188,
        "ORDER_DTM": "8/9/2016 4:10:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROCHLOROTHIAZIDE",
        "ORDER_MNEMONIC": "HYDROCHLOROTHIAZIDE 25 MG PO TABLET"
      },
      {
        "INDEX": 694356,
        "PAT_ID": 20961066,
        "VISIT_NO": 215102698,
        "ORDER_DTM": "8/31/2016 4:20:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Gabapentin",
        "ORDER_MNEMONIC": "GABAPENTIN 100 MG PO CAPS"
      },
      {
        "INDEX": 694357,
        "PAT_ID": 20961066,
        "VISIT_NO": 215199439,
        "ORDER_DTM": "9/1/2016 2:57:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Diclofenac Sodium",
        "ORDER_MNEMONIC": "DICLOFENAC SODIUM 75 MG PO TBEC"
      },
      {
        "INDEX": 694358,
        "PAT_ID": 20961066,
        "VISIT_NO": 215305546,
        "ORDER_DTM": "9/23/2016 1:12:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TraZODone HCl",
        "ORDER_MNEMONIC": "TRAZODONE HCL 50 MG PO TABLET"
      },
      {
        "INDEX": 694419,
        "PAT_ID": 20961066,
        "VISIT_NO": 215740466,
        "ORDER_DTM": "9/27/2016 2:52:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Hydrocodone-Acetaminophen",
        "ORDER_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN 7.5-325 MG PO TABLET"
      },
      {
        "INDEX": 694420,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/20/2017 10:38:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Lisinopril",
        "ORDER_MNEMONIC": "LISINOPRIL 40 MG PO TABLET"
      },
      {
        "INDEX": 694421,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 9:50:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Vancomycin HCl",
        "ORDER_MNEMONIC": "VANCOMYCIN HCL 1 GM POWDER IV SOLR"
      },
      {
        "INDEX": 694422,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 12:34:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TraMADol HCl",
        "ORDER_MNEMONIC": "TRAMADOL HCL 50 MG PO TABLET"
      },
      {
        "INDEX": 694423,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 12:34:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Magnesium Citrate",
        "ORDER_MNEMONIC": "MAGNESIUM CITRATE 1.745 GM/30ML PO SOLN"
      },
      {
        "INDEX": 694424,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 10:28:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Lactated Ringers",
        "ORDER_MNEMONIC": "LACTATED RINGERS IV SOLN"
      },
      {
        "INDEX": 694425,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 10:28:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Ondansetron HCl",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 694426,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 6:17:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CeFAZolin Sodium",
        "ORDER_MNEMONIC": "CEFAZOLIN 1000 MG IV SYRINGE (OMNICELL)"
      },
      {
        "INDEX": 694427,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 12:34:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Ondansetron HCl",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 694428,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 12:34:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Nalbuphine HCl",
        "ORDER_MNEMONIC": "NALBUPHINE HCL 10 MG/ML IJ SOLN"
      },
      {
        "INDEX": 694429,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 8:26:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Thrombin (Recombinant)",
        "ORDER_MNEMONIC": "THROMBIN (RECOMBINANT) 5000 UNITS EX SOLR"
      },
      {
        "INDEX": 694430,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 7:08:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Celecoxib",
        "ORDER_MNEMONIC": "CELECOXIB 200 MG PO CAPS"
      },
      {
        "INDEX": 694431,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 7:08:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Pregabalin",
        "ORDER_MNEMONIC": "PREGABALIN 75 MG PO CAPS"
      },
      {
        "INDEX": 694432,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 12:34:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Methylnaltrexone Bromide",
        "ORDER_MNEMONIC": "METHYLNALTREXONE BROMIDE 12 MG/0.6ML SC SOLN"
      },
      {
        "INDEX": 694433,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 11:25:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Acetaminophen",
        "ORDER_MNEMONIC": "ACETAMINOPHEN 325 MG PO TABLET"
      },
      {
        "INDEX": 694434,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 2:26:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Multiple Vitamins-Minerals",
        "ORDER_MNEMONIC": "MULTIVITAMIN PO"
      },
      {
        "INDEX": 694435,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 10:28:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Albuterol Sulfate",
        "ORDER_MNEMONIC": "ALBUTEROL SULFATE (5 MG/ML) 0.5% IN NEBU"
      },
      {
        "INDEX": 694436,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 12:34:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Metoclopramide HCl",
        "ORDER_MNEMONIC": "METOCLOPRAMIDE HCL 5 MG/ML IJ SOLN"
      },
      {
        "INDEX": 694437,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 12:34:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Bisacodyl",
        "ORDER_MNEMONIC": "BISACODYL 10 MG RE SUPP"
      },
      {
        "INDEX": 694438,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 6:17:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Lidocaine HCl",
        "ORDER_MNEMONIC": "LIDOCAINE HCL 0.5 % IJ SOLN"
      },
      {
        "INDEX": 694439,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 7:08:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Acetaminophen",
        "ORDER_MNEMONIC": "ACETAMINOPHEN 325 MG PO TABLET"
      },
      {
        "INDEX": 694440,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 10:28:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROmorphone HCl",
        "ORDER_MNEMONIC": "HYDROMORPHONE HCL 1 MG/ML IJ SOLN"
      },
      {
        "INDEX": 694441,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 10:51:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Ketamine HCl",
        "ORDER_MNEMONIC": "KETAMINE 250 MG IN 250 ML NS (OMNICELL) IVPB"
      },
      {
        "INDEX": 694442,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 6:17:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Celecoxib",
        "ORDER_MNEMONIC": "CELECOXIB 200 MG PO CAPS"
      },
      {
        "INDEX": 694443,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 6:17:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Lactated Ringers",
        "ORDER_MNEMONIC": "LACTATED RINGERS IV SOLN"
      },
      {
        "INDEX": 694444,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 12:34:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DiphenhydrAMINE HCl",
        "ORDER_MNEMONIC": "DIPHENHYDRAMINE HCL 50 MG/ML IJ SOLN"
      },
      {
        "INDEX": 694445,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 10:28:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DiphenhydrAMINE HCl",
        "ORDER_MNEMONIC": "DIPHENHYDRAMINE HCL 50 MG/ML IJ SOLN"
      },
      {
        "INDEX": 694446,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 8:25:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Gelatin Absorbable",
        "ORDER_MNEMONIC": "GELATIN ABSORBABLE MT POWD"
      },
      {
        "INDEX": 694447,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 6:17:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Pregabalin",
        "ORDER_MNEMONIC": "PREGABALIN 75 MG PO CAPS"
      },
      {
        "INDEX": 694448,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 6:17:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OxyCODONE HCl",
        "ORDER_MNEMONIC": "OXYCODONE HCL ER 10 MG PO T12A"
      },
      {
        "INDEX": 694449,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 10:28:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Promethazine HCl",
        "ORDER_MNEMONIC": "PROMETHAZINE HCL 25 MG/ML IJ SOLN"
      },
      {
        "INDEX": 694450,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 3:26:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Amphetamine-Dextroamphetamine",
        "ORDER_MNEMONIC": "AMPHETAMINE-DEXTROAMPHETAMINE 20 MG PO TABLET"
      },
      {
        "INDEX": 694451,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 10:28:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FentaNYL Citrate",
        "ORDER_MNEMONIC": "FENTANYL CITRATE 0.05 MG/ML IJ SOLN MASTER ERX"
      },
      {
        "INDEX": 694452,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 10:28:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Labetalol HCl",
        "ORDER_MNEMONIC": "LABETALOL HCL 5 MG/ML IV SOLN"
      },
      {
        "INDEX": 694453,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 12:34:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Clindamycin Phosphate",
        "ORDER_MNEMONIC": "CLINDAMYCIN IVPB 900 MG/56ML"
      },
      {
        "INDEX": 694454,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/24/2017 11:49:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Dextrose",
        "ORDER_MNEMONIC": "DEXTROSE 50 % IV SOLN"
      },
      {
        "INDEX": 694455,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/24/2017 10:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Cyclobenzaprine HCl",
        "ORDER_MNEMONIC": "CYCLOBENZAPRINE HCL 5 MG PO TABLET"
      },
      {
        "INDEX": 694456,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/26/2017 10:44:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MetFORMIN HCl",
        "ORDER_MNEMONIC": "METFORMIN HCL 500 MG PO TABLET"
      },
      {
        "INDEX": 694457,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/25/2017 11:04:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Cyclobenzaprine HCl",
        "ORDER_MNEMONIC": "CYCLOBENZAPRINE HCL 5 MG PO TABLET"
      },
      {
        "INDEX": 694458,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 5:00:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Pregabalin",
        "ORDER_MNEMONIC": "PREGABALIN 75 MG PO CAPS"
      },
      {
        "INDEX": 694459,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/27/2017 7:22:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Sennosides-Docusate Sodium",
        "ORDER_MNEMONIC": "SENNOSIDES-DOCUSATE SODIUM 8.6-50 MG PO TABLET"
      },
      {
        "INDEX": 694460,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/26/2017 5:58:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DiazePAM",
        "ORDER_MNEMONIC": "DIAZEPAM 5 MG PO TABLET"
      },
      {
        "INDEX": 694461,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/27/2017 7:22:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DiazePAM",
        "ORDER_MNEMONIC": "DIAZEPAM 5 MG PO TABLET"
      },
      {
        "INDEX": 694462,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/27/2017 7:22:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Pregabalin",
        "ORDER_MNEMONIC": "PREGABALIN 75 MG PO CAPS"
      },
      {
        "INDEX": 694463,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 12:34:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Magnesium Hydroxide",
        "ORDER_MNEMONIC": "MAGNESIUM HYDROXIDE 400 MG/5ML PO SUSP"
      },
      {
        "INDEX": 694464,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/24/2017 11:49:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MetFORMIN HCl",
        "ORDER_MNEMONIC": "METFORMIN HCL 500 MG PO TABLET"
      },
      {
        "INDEX": 694465,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/26/2017 10:11:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Memantine HCl",
        "ORDER_MNEMONIC": "MEMANTINE HCL 10 MG PO TABLET"
      },
      {
        "INDEX": 694466,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/27/2017 7:22:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TraMADol HCl",
        "ORDER_MNEMONIC": "TRAMADOL HCL 50 MG PO TABLET"
      },
      {
        "INDEX": 694467,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 11:25:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OxyCODONE HCl",
        "ORDER_MNEMONIC": "OXYCODONE IR ORAL RANGE RECORD"
      },
      {
        "INDEX": 694468,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 12:34:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Acetaminophen",
        "ORDER_MNEMONIC": "ACETAMINOPHEN 325 MG PO TABLET"
      },
      {
        "INDEX": 694469,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/27/2017 7:22:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Acetaminophen",
        "ORDER_MNEMONIC": "ACETAMINOPHEN 325 MG PO TABLET"
      },
      {
        "INDEX": 694470,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/27/2017 7:22:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OxyCODONE HCl",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABLET"
      },
      {
        "INDEX": 694471,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/27/2017 7:22:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Memantine HCl",
        "ORDER_MNEMONIC": "MEMANTINE HCL 10 MG PO TABLET"
      },
      {
        "INDEX": 694472,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 8:11:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Propofol",
        "ORDER_MNEMONIC": "PROPOFOL10 MG/ML IV EMUL MASTER-ERX"
      },
      {
        "INDEX": 694473,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 9:57:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Ondansetron HCl",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 694474,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 10:13:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Sugammadex Sodium",
        "ORDER_MNEMONIC": "SUGAMMADEX SODIUM 200 MG/2ML IV SOLN"
      },
      {
        "INDEX": 694475,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 8:11:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Lidocaine HCl",
        "ORDER_MNEMONIC": "LIDOCAINE HCL (PF) 4 % IJ SOLN"
      },
      {
        "INDEX": 694476,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 10:04:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROmorphone HCl",
        "ORDER_MNEMONIC": "HYDROMORPHONE HCL 1 MG/ML IJ SOLN"
      },
      {
        "INDEX": 694477,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 8:11:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Rocuronium Bromide",
        "ORDER_MNEMONIC": "ROCURONIUM BROMIDE 100 MG/10ML IV SOLN"
      },
      {
        "INDEX": 694478,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 8:12:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Dexamethasone Sodium Phosphate",
        "ORDER_MNEMONIC": "DEXAMETHASONE SOD PHOSPHATE PF 10 MG/ML IJ SOLN"
      },
      {
        "INDEX": 694479,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 8:11:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Midazolam HCl",
        "ORDER_MNEMONIC": "MIDAZOLAM HCL 2 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 694480,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 8:11:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Ketamine HCl",
        "ORDER_MNEMONIC": "KETAMINE INJECTION 20 MG/2 ML OP-TIME"
      },
      {
        "INDEX": 694481,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 8:10:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "AIRWAY"
      },
      {
        "INDEX": 694482,
        "PAT_ID": 20961066,
        "VISIT_NO": 217694684,
        "ORDER_DTM": "1/20/2017 8:54:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Oxycodone-Acetaminophen",
        "ORDER_MNEMONIC": "OXYCODONE-ACETAMINOPHEN 5-325 MG PO TABLET"
      },
      {
        "INDEX": 694518,
        "PAT_ID": 20961066,
        "VISIT_NO": 215680108,
        "ORDER_DTM": "9/30/2016 9:13:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Sertraline HCl",
        "ORDER_MNEMONIC": "SERTRALINE HCL 25 MG PO TABLET"
      },
      {
        "INDEX": 694519,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/20/2017 10:38:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Oxycodone-Acetaminophen",
        "ORDER_MNEMONIC": "OXYCODONE-ACETAMINOPHEN 7.5-325 MG PO TABLET"
      },
      {
        "INDEX": 694520,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 12:34:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DiphenhydrAMINE HCl",
        "ORDER_MNEMONIC": "DIPHENHYDRAMINE HCL 25 MG PO CAPS"
      },
      {
        "INDEX": 694521,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 7:08:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Tapentadol HCl",
        "ORDER_MNEMONIC": "TAPENTADOL HCL 50 MG PO TABLET"
      },
      {
        "INDEX": 694522,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 10:28:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Meperidine HCl",
        "ORDER_MNEMONIC": "MEPERIDINE HCL 25 MG/ML IJ SOLN"
      },
      {
        "INDEX": 694523,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 8:25:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Neomycin-Polymyxin B GU",
        "ORDER_MNEMONIC": "NEOSPORIN GU IRRIGATION 4 ML/1000 ML NS"
      },
      {
        "INDEX": 694524,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 10:28:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HydrALAZINE HCl",
        "ORDER_MNEMONIC": "HYDRALAZINE HCL 20 MG/ML IJ SOLN"
      },
      {
        "INDEX": 694525,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 8:11:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Magnesium Sulfate",
        "ORDER_MNEMONIC": "MAGNESIUM SULFATE 20 GM/500ML IV SOLN"
      },
      {
        "INDEX": 694526,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/24/2017 11:49:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Insulin Lispro",
        "ORDER_MNEMONIC": "INSULIN LISPRO 100 UNIT/ML SC SOLN"
      },
      {
        "INDEX": 694527,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 10:51:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Ketamine HCl",
        "ORDER_MNEMONIC": "KETAMINE 250 MG IN 250 ML NS (OMNICELL) IVPB"
      },
      {
        "INDEX": 694528,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/24/2017 2:41:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Cholecalciferol",
        "ORDER_MNEMONIC": "VITAMIN D3 (CHOLECALCIFEROL) 50000 UNITS PO CAPS"
      },
      {
        "INDEX": 694529,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 12:34:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Polyethylene Glycol 3350",
        "ORDER_MNEMONIC": "POLYETHYLENE GLYCOL 3350 PO PACK"
      },
      {
        "INDEX": 694530,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 12:34:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Sennosides-Docusate Sodium",
        "ORDER_MNEMONIC": "SENNOSIDES-DOCUSATE SODIUM 8.6-50 MG PO TABLET"
      },
      {
        "INDEX": 694531,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 8:11:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FentaNYL Citrate",
        "ORDER_MNEMONIC": "FENTANYL CITRATE 0.05 MG/ML IJ SOLN MASTER ERX"
      },
      {
        "INDEX": 694532,
        "PAT_ID": 20961066,
        "VISIT_NO": 217295494,
        "ORDER_DTM": "1/23/2017 7:56:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Clindamycin Phosphate",
        "ORDER_MNEMONIC": "CLINDAMYCIN IVPB OP-TIME"
      },
      {
        "INDEX": 694533,
        "PAT_ID": 20961066,
        "VISIT_NO": 217694684,
        "ORDER_DTM": "1/20/2017 8:53:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HydroCHLOROthiazide",
        "ORDER_MNEMONIC": "HYDROCHLOROTHIAZIDE 25 MG PO TABLET"
      },
      {
        "INDEX": 694534,
        "PAT_ID": 20961066,
        "VISIT_NO": 218778914,
        "ORDER_DTM": "2/9/2017 8:23:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OxyCODONE HCl",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABLET"
      }
    ],
    20559329: [
      {
        "INDEX": 6245,
        "PAT_ID": 20559329,
        "VISIT_NO": 0,
        "ORDER_DTM": "2/20/2014",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "NDL EMG 1 XTR W/WO RELATED PARASPINAL AREAS",
        "ORDER_MNEMONIC": "EMG, NEEDLE, ONE LIMB"
      },
      {
        "INDEX": 6246,
        "PAT_ID": 20559329,
        "VISIT_NO": 0,
        "ORDER_DTM": "8/25/2014",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "ARTHRP ACETBLR/PROX FEM PROSTC AGRFT/ALGRFT",
        "ORDER_MNEMONIC": "TOTAL HIP ARTHROPLASTY"
      },
      {
        "INDEX": 6247,
        "PAT_ID": 20559329,
        "VISIT_NO": 0,
        "ORDER_DTM": "8/13/2015",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "ARTHRP KNE CONDYLE&PLATU MEDIAL&LAT COMPARTMENTS",
        "ORDER_MNEMONIC": "TOTAL KNEE ARTHROPLASTY"
      },
      {
        "INDEX": 6248,
        "PAT_ID": 20559329,
        "VISIT_NO": 0,
        "ORDER_DTM": "11/6/2015",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THER PX 1/> AREAS EACH 15 MIN NEUROMUSC REEDUCA",
        "ORDER_MNEMONIC": "NEUROMUSC REEDUCAT,1+ AREAS, EA 15 MIN"
      },
      {
        "INDEX": 6249,
        "PAT_ID": 20559329,
        "VISIT_NO": 0,
        "ORDER_DTM": "11/6/2015",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "MANUAL THERAPY TQS 1/> REGIONS EACH 15 MINUTES",
        "ORDER_MNEMONIC": "MANUAL THER TECH,1+REGIONS,EA 15 MIN"
      },
      {
        "INDEX": 6250,
        "PAT_ID": 20559329,
        "VISIT_NO": 0,
        "ORDER_DTM": "11/6/2015",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6251,
        "PAT_ID": 20559329,
        "VISIT_NO": 0,
        "ORDER_DTM": "11/18/2015",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6252,
        "PAT_ID": 20559329,
        "VISIT_NO": 0,
        "ORDER_DTM": "11/18/2015",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THER PX 1/> AREAS EACH 15 MIN NEUROMUSC REEDUCA",
        "ORDER_MNEMONIC": "NEUROMUSC REEDUCAT,1+ AREAS, EA 15 MIN"
      },
      {
        "INDEX": 6253,
        "PAT_ID": 20559329,
        "VISIT_NO": 0,
        "ORDER_DTM": "11/18/2015",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "MANUAL THERAPY TQS 1/> REGIONS EACH 15 MINUTES",
        "ORDER_MNEMONIC": "MANUAL THER TECH,1+REGIONS,EA 15 MIN"
      },
      {
        "INDEX": 6254,
        "PAT_ID": 20559329,
        "VISIT_NO": 0,
        "ORDER_DTM": "5/13/2016",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "ARTHROPLASTY GLENOHUMERAL JOINT TOTAL SHOULDER",
        "ORDER_MNEMONIC": "RECONSTR TOTAL SHOULDER IMPLANT"
      },
      {
        "INDEX": 6255,
        "PAT_ID": 20559329,
        "VISIT_NO": 195658817,
        "ORDER_DTM": "11/7/2013 12:43:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPHENIDATE HCL",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABS"
      },
      {
        "INDEX": 6256,
        "PAT_ID": 20559329,
        "VISIT_NO": 195658817,
        "ORDER_DTM": "11/7/2013 12:50:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "IPRATROPIUM BROMIDE",
        "ORDER_MNEMONIC": "IPRATROPIUM BROMIDE 0.06 % NA SOLN"
      },
      {
        "INDEX": 6257,
        "PAT_ID": 20559329,
        "VISIT_NO": 195658817,
        "ORDER_DTM": "11/7/2013 12:43:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPHENIDATE HCL",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABS"
      },
      {
        "INDEX": 6258,
        "PAT_ID": 20559329,
        "VISIT_NO": 195658817,
        "ORDER_DTM": "11/7/2013 12:43:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPHENIDATE HCL",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABS"
      },
      {
        "INDEX": 6259,
        "PAT_ID": 20559329,
        "VISIT_NO": 195658817,
        "ORDER_DTM": "11/7/2013 12:50:00 PM",
        "ORDER_STATUS": "SUSPEND",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "TEST STRIPS"
      },
      {
        "INDEX": 6260,
        "PAT_ID": 20559329,
        "VISIT_NO": 195658817,
        "ORDER_DTM": "11/7/2013 12:59:00 PM",
        "ORDER_STATUS": "SUSPEND",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LANCET DEVICES",
        "ORDER_MNEMONIC": "LANCET DEVICE MISC"
      },
      {
        "INDEX": 6261,
        "PAT_ID": 20559329,
        "VISIT_NO": 195658817,
        "ORDER_DTM": "11/7/2013 12:50:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BLOOD GLUCOSE MONITORING SUPPL",
        "ORDER_MNEMONIC": "BLOOD GLUCOSE MONITOR KIT"
      },
      {
        "INDEX": 6262,
        "PAT_ID": 20559329,
        "VISIT_NO": 195927818,
        "ORDER_DTM": "12/5/2013 10:47:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PREGABALIN",
        "ORDER_MNEMONIC": "PREGABALIN 200 MG PO CAPS"
      },
      {
        "INDEX": 6263,
        "PAT_ID": 20559329,
        "VISIT_NO": 195927818,
        "ORDER_DTM": "12/5/2013 11:21:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PRAVASTATIN SODIUM",
        "ORDER_MNEMONIC": "PRAVASTATIN SODIUM 40 MG PO TABS"
      },
      {
        "INDEX": 6264,
        "PAT_ID": 20559329,
        "VISIT_NO": 195927818,
        "ORDER_DTM": "12/5/2013 10:47:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "IBUPROFEN",
        "ORDER_MNEMONIC": "MOTRIN PO"
      },
      {
        "INDEX": 6265,
        "PAT_ID": 20559329,
        "VISIT_NO": 196073576,
        "ORDER_DTM": "2/4/2014 6:35:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 6266,
        "PAT_ID": 20559329,
        "VISIT_NO": 196073576,
        "ORDER_DTM": "2/4/2014 6:37:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DIPHENHYDRAMINE HCL",
        "ORDER_MNEMONIC": "DIPHENHYDRAMINE HCL 25 MG PO TABS"
      },
      {
        "INDEX": 6267,
        "PAT_ID": 20559329,
        "VISIT_NO": 196073576,
        "ORDER_DTM": "2/4/2014 6:47:00 PM",
        "ORDER_STATUS": "SUSPEND",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OMEPRAZOLE",
        "ORDER_MNEMONIC": "PRILOSEC PO"
      },
      {
        "INDEX": 6268,
        "PAT_ID": 20559329,
        "VISIT_NO": 196376600,
        "ORDER_DTM": "1/13/2014 9:08:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN",
        "ORDER_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN 5-325 MG PO TABS"
      },
      {
        "INDEX": 6269,
        "PAT_ID": 20559329,
        "VISIT_NO": 196446965,
        "ORDER_DTM": "1/8/2014 10:56:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METFORMIN HCL",
        "ORDER_MNEMONIC": "METFORMIN HCL 500 MG PO TABS"
      },
      {
        "INDEX": 6270,
        "PAT_ID": 20559329,
        "VISIT_NO": 196446965,
        "ORDER_DTM": "1/8/2014 10:56:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CITALOPRAM HYDROBROMIDE",
        "ORDER_MNEMONIC": "CITALOPRAM HYDROBROMIDE 40 MG PO TABS"
      },
      {
        "INDEX": 6271,
        "PAT_ID": 20559329,
        "VISIT_NO": 196446965,
        "ORDER_DTM": "1/8/2014 10:56:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LEVOTHYROXINE SODIUM",
        "ORDER_MNEMONIC": "LEVOTHYROXINE SODIUM 112 MCG PO TABS"
      },
      {
        "INDEX": 6272,
        "PAT_ID": 20559329,
        "VISIT_NO": 197071726,
        "ORDER_DTM": "3/4/2014 11:41:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CLINDAMYCIN HCL",
        "ORDER_MNEMONIC": "CLINDAMYCIN HCL 300 MG PO CAPS"
      },
      {
        "INDEX": 6273,
        "PAT_ID": 20559329,
        "VISIT_NO": 197104062,
        "ORDER_DTM": "4/11/2014 10:36:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6274,
        "PAT_ID": 20559329,
        "VISIT_NO": 197640959,
        "ORDER_DTM": "4/11/2014 12:59:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6275,
        "PAT_ID": 20559329,
        "VISIT_NO": 198448214,
        "ORDER_DTM": "5/15/2014 4:56:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CEPHALEXIN",
        "ORDER_MNEMONIC": "CEPHALEXIN 500 MG PO CAPS"
      },
      {
        "INDEX": 6276,
        "PAT_ID": 20559329,
        "VISIT_NO": 198460949,
        "ORDER_DTM": "5/16/2014 2:26:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CEPHALEXIN",
        "ORDER_MNEMONIC": "CEPHALEXIN 500 MG PO CAPS"
      },
      {
        "INDEX": 6277,
        "PAT_ID": 20559329,
        "VISIT_NO": 200103146,
        "ORDER_DTM": "8/22/2014 11:17:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPHENIDATE HCL",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABS"
      },
      {
        "INDEX": 6278,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 5:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ACETAMINOPHEN",
        "ORDER_MNEMONIC": "ACETAMINOPHEN 325 MG PO TABS"
      },
      {
        "INDEX": 6279,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 6:06:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL ER 10 MG PO T12A"
      },
      {
        "INDEX": 6280,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 10:20:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SKIN ADHESIVES",
        "ORDER_MNEMONIC": "SKIN ADHESIVES EX LIQD"
      },
      {
        "INDEX": 6281,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 5:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG PO TABS"
      },
      {
        "INDEX": 6282,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/9/2014 7:39:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ASPIRIN",
        "ORDER_MNEMONIC": "ASPIRIN 81 MG PO CHEW"
      },
      {
        "INDEX": 6283,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 5:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SODIUM PHOSPHATES",
        "ORDER_MNEMONIC": "FLEET ENEMA 7-19 GM/118ML RE ENEM"
      },
      {
        "INDEX": 6284,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 2:56:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LACTATED RINGERS",
        "ORDER_MNEMONIC": "LACTATED RINGERS IV SOLN"
      },
      {
        "INDEX": 6285,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 2:56:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "CEFAZOLIN 1000 MG IV SYRINGE (OMNICELL)"
      },
      {
        "INDEX": 6286,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 9:19:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "INFLUENZA VAC SPLIT QUAD",
        "ORDER_MNEMONIC": "INFLUENZA VAC SPLIT QUAD 0.5 ML IM SUSP"
      },
      {
        "INDEX": 6287,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 5:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BISACODYL",
        "ORDER_MNEMONIC": "BISACODYL 5 MG PO TBEC"
      },
      {
        "INDEX": 6288,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 5:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "HYDROMORPHONE INJ DOSE RANGE RECORD"
      },
      {
        "INDEX": 6289,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 10:20:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BUPIVACAINE-EPINEPHRINE",
        "ORDER_MNEMONIC": "BUPIVACAINE-EPINEPHRINE 0.25-1:200000 % IJ SOLN"
      },
      {
        "INDEX": 6290,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 5:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "POLYETHYLENE GLYCOL 3350",
        "ORDER_MNEMONIC": "POLYETHYLENE GLYCOL 3350 PO PACK"
      },
      {
        "INDEX": 6291,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 5:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "OXYCODONE IR ORAL RANGE RECORD"
      },
      {
        "INDEX": 6292,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 5:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BISACODYL",
        "ORDER_MNEMONIC": "BISACODYL 10 MG RE SUPP"
      },
      {
        "INDEX": 6293,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/9/2014 7:39:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MAGNESIUM HYDROXIDE",
        "ORDER_MNEMONIC": "MAGNESIUM HYDROXIDE 400 MG/5ML PO SUSP"
      },
      {
        "INDEX": 6294,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/9/2014 7:39:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SENNOSIDES",
        "ORDER_MNEMONIC": "SENNA 8.6 MG PO TABS"
      },
      {
        "INDEX": 6295,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/9/2014 7:39:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG PO TABS"
      },
      {
        "INDEX": 6296,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 10:33:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROMORPHONE HCL",
        "ORDER_MNEMONIC": "HYDROMORPHONE HCL PF 1 MG/ML IJ SOLN"
      },
      {
        "INDEX": 6297,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 10:33:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DIPHENHYDRAMINE HCL",
        "ORDER_MNEMONIC": "DIPHENHYDRAMINE HCL 50 MG/ML IJ SOLN"
      },
      {
        "INDEX": 6298,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 10:33:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LABETALOL HCL",
        "ORDER_MNEMONIC": "LABETALOL HCL 5 MG/ML IV SOLN"
      },
      {
        "INDEX": 6299,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 6:06:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PREGABALIN",
        "ORDER_MNEMONIC": "PREGABALIN 50 MG PO CAPS"
      },
      {
        "INDEX": 6300,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 10:33:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HALOPERIDOL LACTATE",
        "ORDER_MNEMONIC": "HALOPERIDOL LACTATE 5 MG/ML IJ SOLN"
      },
      {
        "INDEX": 6301,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 10:33:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MIDAZOLAM HCL",
        "ORDER_MNEMONIC": "MIDAZOLAM HCL 2 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 6302,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 5:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 6303,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 9:01:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "NEOMYCIN-POLYMYXIN B GU",
        "ORDER_MNEMONIC": "NEOSPORIN GU IRRIGATION 4 ML/1000 ML NS"
      },
      {
        "INDEX": 6304,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 9:01:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SODIUM CHLORIDE (GU IRRIGANT)",
        "ORDER_MNEMONIC": "SODIUM CHLORIDE 0.9 % IR SOLN"
      },
      {
        "INDEX": 6305,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 10:33:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDRALAZINE HCL",
        "ORDER_MNEMONIC": "HYDRALAZINE HCL 20 MG/ML IJ SOLN"
      },
      {
        "INDEX": 6306,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/9/2014 7:39:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BISACODYL",
        "ORDER_MNEMONIC": "BISACODYL 5 MG PO TBEC"
      },
      {
        "INDEX": 6307,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/9/2014 7:39:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ACETAMINOPHEN",
        "ORDER_MNEMONIC": "ACETAMINOPHEN 325 MG PO TABS"
      },
      {
        "INDEX": 6308,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/9/2014 7:39:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG PO TABS"
      },
      {
        "INDEX": 6309,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 5:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SENNOSIDES",
        "ORDER_MNEMONIC": "SENNA 8.6 MG PO TABS"
      },
      {
        "INDEX": 6310,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 10:33:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PROMETHAZINE HCL",
        "ORDER_MNEMONIC": "PROMETHAZINE HCL 25 MG/ML IJ SOLN"
      },
      {
        "INDEX": 6311,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 10:33:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FENTANYL CITRATE",
        "ORDER_MNEMONIC": "FENTANYL CITRATE 0.05 MG/ML IJ SOLN"
      },
      {
        "INDEX": 6312,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/8/2014 8:36:00 AM",
        "ORDER_STATUS": "SUSPEND",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LISINOPRIL",
        "ORDER_MNEMONIC": "LISINOPRIL 5 MG PO TABS"
      },
      {
        "INDEX": 6313,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 2:56:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ASPIRIN",
        "ORDER_MNEMONIC": "ASPIRIN 81 MG PO CHEW"
      },
      {
        "INDEX": 6314,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/9/2014 7:39:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 6315,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 6:06:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "CEFAZOLIN 1000 MG IV SYRINGE (OMNICELL)"
      },
      {
        "INDEX": 6316,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 2:56:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MULTIPLE VITAMIN",
        "ORDER_MNEMONIC": "TAB-A-VITE PO TABS"
      },
      {
        "INDEX": 6317,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 5:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MAGNESIUM HYDROXIDE",
        "ORDER_MNEMONIC": "MAGNESIUM HYDROXIDE 400 MG/5ML PO SUSP"
      },
      {
        "INDEX": 6318,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 10:33:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LACTATED RINGERS",
        "ORDER_MNEMONIC": "LACTATED RINGERS IV SOLN"
      },
      {
        "INDEX": 6319,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 7:37:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "LACTATED RINGERS IV BOLUS"
      },
      {
        "INDEX": 6320,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 9:00:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRANEXAMIC ACID",
        "ORDER_MNEMONIC": "TRANEXAMIC ACID 100 MG/ML IV SOLN"
      },
      {
        "INDEX": 6321,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 8:31:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "PROPOFOL INFUSION 10 MG/ML"
      },
      {
        "INDEX": 6322,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 8:53:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 6323,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 8:52:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MIDAZOLAM HCL",
        "ORDER_MNEMONIC": "MIDAZOLAM HCL 2 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 6324,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 8:52:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FENTANYL CITRATE",
        "ORDER_MNEMONIC": "FENTANYL CITRATE 0.05 MG/ML IJ SOLN"
      },
      {
        "INDEX": 6325,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 8:53:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 6326,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 8:27:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "PROPOFOL INFUSION 10 MG/ML"
      },
      {
        "INDEX": 6327,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 9:00:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CEFAZOLIN SODIUM",
        "ORDER_MNEMONIC": "CEFAZOLIN SODIUM 1 G POWDER IJ SOLR"
      },
      {
        "INDEX": 6328,
        "PAT_ID": 20559329,
        "VISIT_NO": 200104149,
        "ORDER_DTM": "10/7/2014 8:54:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "UHC ANE SPINAL ANESTHESIA"
      },
      {
        "INDEX": 6329,
        "PAT_ID": 20559329,
        "VISIT_NO": 201011756,
        "ORDER_DTM": "10/21/2014 5:25:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPHENIDATE HCL",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABS"
      },
      {
        "INDEX": 6330,
        "PAT_ID": 20559329,
        "VISIT_NO": 201011756,
        "ORDER_DTM": "10/21/2014 5:27:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CITALOPRAM HYDROBROMIDE",
        "ORDER_MNEMONIC": "CITALOPRAM HYDROBROMIDE 40 MG PO TABS"
      },
      {
        "INDEX": 6331,
        "PAT_ID": 20559329,
        "VISIT_NO": 201011756,
        "ORDER_DTM": "10/21/2014 5:27:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CITALOPRAM HYDROBROMIDE",
        "ORDER_MNEMONIC": "CITALOPRAM HYDROBROMIDE 40 MG PO TABS"
      },
      {
        "INDEX": 6332,
        "PAT_ID": 20559329,
        "VISIT_NO": 201011756,
        "ORDER_DTM": "10/21/2014 5:26:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPHENIDATE HCL",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABS"
      },
      {
        "INDEX": 6333,
        "PAT_ID": 20559329,
        "VISIT_NO": 201011756,
        "ORDER_DTM": "10/21/2014 5:26:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPHENIDATE HCL",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABS"
      },
      {
        "INDEX": 6334,
        "PAT_ID": 20559329,
        "VISIT_NO": 201224112,
        "ORDER_DTM": "10/17/2014 9:13:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LIDOCAINE HCL",
        "ORDER_MNEMONIC": "LIDOCAINE HCL 2 % IJ SOLN"
      },
      {
        "INDEX": 6335,
        "PAT_ID": 20559329,
        "VISIT_NO": 201224112,
        "ORDER_DTM": "10/17/2014 10:19:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CEPHALEXIN",
        "ORDER_MNEMONIC": "CEPHALEXIN 500 MG PO CAPS"
      },
      {
        "INDEX": 6336,
        "PAT_ID": 20559329,
        "VISIT_NO": 201224112,
        "ORDER_DTM": "10/17/2014 10:21:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "ED LACERATION REPAIR",
        "ORDER_MNEMONIC": "ED LACERATION REPAIR"
      },
      {
        "INDEX": 6337,
        "PAT_ID": 20559329,
        "VISIT_NO": 201435665,
        "ORDER_DTM": "11/10/2014 12:10:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PHYSICAL THERAPY EVALUATION",
        "ORDER_MNEMONIC": "PHYS THERAPY EVALUATION"
      },
      {
        "INDEX": 6338,
        "PAT_ID": 20559329,
        "VISIT_NO": 201435665,
        "ORDER_DTM": "11/10/2014 12:10:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6339,
        "PAT_ID": 20559329,
        "VISIT_NO": 201435665,
        "ORDER_DTM": "11/10/2014 12:11:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PT MEDICARE PLAN OF CARE CERT/RE-CERT",
        "ORDER_MNEMONIC": "PT MEDICARE PLAN OF CARE CERT/RE-CERT"
      },
      {
        "INDEX": 6340,
        "PAT_ID": 20559329,
        "VISIT_NO": 201435756,
        "ORDER_DTM": "11/13/2014 11:08:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6341,
        "PAT_ID": 20559329,
        "VISIT_NO": 201435793,
        "ORDER_DTM": "11/20/2014 11:13:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6342,
        "PAT_ID": 20559329,
        "VISIT_NO": 201708048,
        "ORDER_DTM": "11/26/2014 9:06:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6343,
        "PAT_ID": 20559329,
        "VISIT_NO": 201708050,
        "ORDER_DTM": "12/2/2014 1:02:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6344,
        "PAT_ID": 20559329,
        "VISIT_NO": 201710994,
        "ORDER_DTM": "12/9/2014 2:42:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6345,
        "PAT_ID": 20559329,
        "VISIT_NO": 201710994,
        "ORDER_DTM": "12/9/2014 2:42:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PHYSICAL THERAPY RE-EVALUATION",
        "ORDER_MNEMONIC": "PHYS THERAPY RE-EVALUATION"
      },
      {
        "INDEX": 6346,
        "PAT_ID": 20559329,
        "VISIT_NO": 202101271,
        "ORDER_DTM": "1/2/2015 11:42:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LIDOCAINE HCL",
        "ORDER_MNEMONIC": "LIDOCAINE HCL 1 % IJ SOLN"
      },
      {
        "INDEX": 6347,
        "PAT_ID": 20559329,
        "VISIT_NO": 202101271,
        "ORDER_DTM": "1/2/2015 11:42:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRIAMCINOLONE ACETONIDE",
        "ORDER_MNEMONIC": "TRIAMCINOLONE ACETONIDE 40 MG/ML IJ SUSP"
      },
      {
        "INDEX": 6348,
        "PAT_ID": 20559329,
        "VISIT_NO": 202101271,
        "ORDER_DTM": "1/2/2015 11:42:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BUPIVACAINE HCL",
        "ORDER_MNEMONIC": "BUPIVACAINE HCL (PF) 0.5 % IJ SOLN"
      },
      {
        "INDEX": 6349,
        "PAT_ID": 20559329,
        "VISIT_NO": 202101271,
        "ORDER_DTM": "1/2/2015 11:42:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "ARTHROCENTESIS ASPIR&/INJECTION MAJOR JT/BURSA",
        "ORDER_MNEMONIC": "DRAIN/INJECT LARGE JOINT/BURSA"
      },
      {
        "INDEX": 6350,
        "PAT_ID": 20559329,
        "VISIT_NO": 202665715,
        "ORDER_DTM": "1/12/2015 10:40:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CITALOPRAM HYDROBROMIDE",
        "ORDER_MNEMONIC": "CITALOPRAM HYDROBROMIDE 40 MG PO TABS"
      },
      {
        "INDEX": 6351,
        "PAT_ID": 20559329,
        "VISIT_NO": 202665715,
        "ORDER_DTM": "1/12/2015 10:38:00 AM",
        "ORDER_STATUS": "SUSPEND",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPHENIDATE HCL",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABS"
      },
      {
        "INDEX": 6352,
        "PAT_ID": 20559329,
        "VISIT_NO": 202665715,
        "ORDER_DTM": "1/12/2015 9:52:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPHENIDATE HCL",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABS"
      },
      {
        "INDEX": 6353,
        "PAT_ID": 20559329,
        "VISIT_NO": 202665715,
        "ORDER_DTM": "1/12/2015 10:38:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPHENIDATE HCL",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABS"
      },
      {
        "INDEX": 6354,
        "PAT_ID": 20559329,
        "VISIT_NO": 202665715,
        "ORDER_DTM": "1/12/2015 10:37:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPHENIDATE HCL",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABS"
      },
      {
        "INDEX": 6355,
        "PAT_ID": 20559329,
        "VISIT_NO": 202933432,
        "ORDER_DTM": "1/23/2015 10:56:00 AM",
        "ORDER_STATUS": "SUSPEND",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MELOXICAM",
        "ORDER_MNEMONIC": "MELOXICAM 15 MG PO TABS"
      },
      {
        "INDEX": 6356,
        "PAT_ID": 20559329,
        "VISIT_NO": 203166072,
        "ORDER_DTM": "2/11/2015 6:20:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PREGABALIN",
        "ORDER_MNEMONIC": "PREGABALIN 150 MG PO CAPS"
      },
      {
        "INDEX": 6357,
        "PAT_ID": 20559329,
        "VISIT_NO": 203246068,
        "ORDER_DTM": "2/9/2015 7:51:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METFORMIN HCL",
        "ORDER_MNEMONIC": "METFORMIN HCL 500 MG PO TABS"
      },
      {
        "INDEX": 6358,
        "PAT_ID": 20559329,
        "VISIT_NO": 203278460,
        "ORDER_DTM": "2/9/2015 2:00:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CEPHALEXIN",
        "ORDER_MNEMONIC": "CEPHALEXIN 500 MG PO CAPS"
      },
      {
        "INDEX": 6359,
        "PAT_ID": 20559329,
        "VISIT_NO": 203722245,
        "ORDER_DTM": "3/4/2015 12:29:00 PM",
        "ORDER_STATUS": "SUSPEND",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LEVOTHYROXINE SODIUM",
        "ORDER_MNEMONIC": "LEVOTHYROXINE SODIUM 112 MCG PO TABS"
      },
      {
        "INDEX": 6360,
        "PAT_ID": 20559329,
        "VISIT_NO": 204275635,
        "ORDER_DTM": "3/30/2015 12:55:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "COLLECTION VENOUS BLOOD VENIPUNCTURE",
        "ORDER_MNEMONIC": "COLLECTION VENOUS BLOOD,VENIPUNCTURE"
      },
      {
        "INDEX": 6361,
        "PAT_ID": 20559329,
        "VISIT_NO": 204488781,
        "ORDER_DTM": "4/9/2015 10:45:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DIPHENHYDRAMINE-APAP (SLEEP)",
        "ORDER_MNEMONIC": "TYLENOL PM EXTRA STRENGTH PO"
      },
      {
        "INDEX": 6362,
        "PAT_ID": 20559329,
        "VISIT_NO": 204488781,
        "ORDER_DTM": "4/9/2015 10:45:00 AM",
        "ORDER_STATUS": "SUSPEND",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "IBUPROFEN",
        "ORDER_MNEMONIC": "IBUPROFEN 800 MG PO TABS"
      },
      {
        "INDEX": 6363,
        "PAT_ID": 20559329,
        "VISIT_NO": 204493141,
        "ORDER_DTM": "4/9/2015 11:24:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "12 LEAD ECG (EKG)",
        "ORDER_MNEMONIC": "12 LEAD ECG (EKG)"
      },
      {
        "INDEX": 6364,
        "PAT_ID": 20559329,
        "VISIT_NO": 204717705,
        "ORDER_DTM": "4/21/2015 3:45:00 PM",
        "ORDER_STATUS": "SUSPEND",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ATORVASTATIN CALCIUM",
        "ORDER_MNEMONIC": "ATORVASTATIN CALCIUM 10 MG PO TABS"
      },
      {
        "INDEX": 6365,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/12/2015 10:51:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LEVOTHYROXINE SODIUM",
        "ORDER_MNEMONIC": "LEVOTHYROXINE SODIUM 100 MCG PO TABS"
      },
      {
        "INDEX": 6366,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/12/2015 10:47:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Blood Glucose Monitoring Suppl",
        "ORDER_MNEMONIC": "BLOOD GLUCOSE MONITORING SUPPL DEVI"
      },
      {
        "INDEX": 6367,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/12/2015 10:47:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Glucose Blood",
        "ORDER_MNEMONIC": "GLUCOSE BLOOD VI STRP"
      },
      {
        "INDEX": 6368,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/12/2015 10:47:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Glucose Blood",
        "ORDER_MNEMONIC": "GLUCOSE BLOOD VI STRP"
      },
      {
        "INDEX": 6369,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/12/2015 10:07:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MAGNESIUM OXIDE",
        "ORDER_MNEMONIC": "MAGNESIUM OXIDE 400 (241.3 MG) MG PO TABS"
      },
      {
        "INDEX": 6370,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/12/2015 10:07:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DIPHENHYDRAMINE-APAP (SLEEP)",
        "ORDER_MNEMONIC": "DIPHENHYDRAMINE-APAP (SLEEP) 25-500 MG PO TABS"
      },
      {
        "INDEX": 6371,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/12/2015 10:07:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Cyanocobalamin",
        "ORDER_MNEMONIC": "VITAMIN B-12 ER 1000 MCG PO TBCR"
      },
      {
        "INDEX": 6372,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/12/2015 10:47:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Lancets",
        "ORDER_MNEMONIC": "FREESTYLE LANCETS MISC"
      },
      {
        "INDEX": 6373,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/12/2015 10:07:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LANSOPRAZOLE",
        "ORDER_MNEMONIC": "LANSOPRAZOLE 30 MG PO CPDR"
      },
      {
        "INDEX": 6374,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 8:54:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BUPIVACAINE-EPINEPHRINE",
        "ORDER_MNEMONIC": "BUPIVACAINE-EPINEPHRINE 0.25% -1:200000 IJ SOLN"
      },
      {
        "INDEX": 6375,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 8:55:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "SODIUM CHLORIDE 0.9% (PF) IJ SOLN"
      },
      {
        "INDEX": 6376,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 8:55:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "GENTAMICIN 0.5 G IN BONE CEMENT"
      },
      {
        "INDEX": 6377,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 10:25:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 6378,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 2:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BISACODYL",
        "ORDER_MNEMONIC": "BISACODYL 10 MG RE SUPP"
      },
      {
        "INDEX": 6379,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 2:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BISACODYL",
        "ORDER_MNEMONIC": "BISACODYL 5 MG PO TBEC"
      },
      {
        "INDEX": 6380,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 3:09:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LISINOPRIL",
        "ORDER_MNEMONIC": "LISINOPRIL 10 MG PO TABS"
      },
      {
        "INDEX": 6381,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 8:56:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SODIUM CHLORIDE (GU IRRIGANT)",
        "ORDER_MNEMONIC": "SODIUM CHLORIDE 0.9 % IR SOLN"
      },
      {
        "INDEX": 6382,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 3:02:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ATORVASTATIN CALCIUM",
        "ORDER_MNEMONIC": "ATORVASTATIN CALCIUM 10 MG PO TABS"
      },
      {
        "INDEX": 6383,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 2:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MULTIPLE VITAMIN",
        "ORDER_MNEMONIC": "TAB-A-VITE PO TABS"
      },
      {
        "INDEX": 6384,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 6:05:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "CEFAZOLIN 1000 MG IV SYRINGE (OMNICELL)"
      },
      {
        "INDEX": 6385,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 2:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MAGNESIUM HYDROXIDE",
        "ORDER_MNEMONIC": "MAGNESIUM HYDROXIDE 400 MG/5ML PO SUSP"
      },
      {
        "INDEX": 6386,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 10:25:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DIPHENHYDRAMINE HCL",
        "ORDER_MNEMONIC": "DIPHENHYDRAMINE HCL 50 MG/ML IJ SOLN"
      },
      {
        "INDEX": 6387,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 10:25:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LACTATED RINGERS",
        "ORDER_MNEMONIC": "LACTATED RINGERS IV SOLN"
      },
      {
        "INDEX": 6388,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 6:05:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ACETAMINOPHEN",
        "ORDER_MNEMONIC": "ACETAMINOPHEN 325 MG PO TABS"
      },
      {
        "INDEX": 6389,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 6:05:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRAMADOL HCL",
        "ORDER_MNEMONIC": "TRAMADOL HCL 50 MG PO TABS"
      },
      {
        "INDEX": 6390,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 2:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG PO TABS"
      },
      {
        "INDEX": 6391,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 2:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "POLYETHYLENE GLYCOL 3350",
        "ORDER_MNEMONIC": "POLYETHYLENE GLYCOL 3350 PO PACK"
      },
      {
        "INDEX": 6392,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 3:09:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPHENIDATE HCL",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABS"
      },
      {
        "INDEX": 6393,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 2:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SODIUM CHLORIDE",
        "ORDER_MNEMONIC": "SODIUM CHLORIDE 0.9 % IV SOLN"
      },
      {
        "INDEX": 6394,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 8:55:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SKIN ADHESIVES",
        "ORDER_MNEMONIC": "SKIN ADHESIVES EX LIQD"
      },
      {
        "INDEX": 6395,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 10:25:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FENTANYL CITRATE",
        "ORDER_MNEMONIC": "FENTANYL CITRATE 0.05 MG/ML IJ SOLN"
      },
      {
        "INDEX": 6396,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 4:11:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPHENIDATE HCL",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 6397,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 2:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OMEPRAZOLE",
        "ORDER_MNEMONIC": "OMEPRAZOLE 40 MG PO CPDR"
      },
      {
        "INDEX": 6398,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 5:08:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CYCLOBENZAPRINE HCL",
        "ORDER_MNEMONIC": "CYCLOBENZAPRINE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 6399,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 4:11:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LEVOTHYROXINE SODIUM",
        "ORDER_MNEMONIC": "LEVOTHYROXINE SODIUM 100 MCG PO TABS"
      },
      {
        "INDEX": 6400,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 2:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CITALOPRAM HYDROBROMIDE",
        "ORDER_MNEMONIC": "CITALOPRAM HYDROBROMIDE 40 MG PO TABS"
      },
      {
        "INDEX": 6401,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 8:55:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "NEOMYCIN-POLYMYXIN B GU",
        "ORDER_MNEMONIC": "NEOSPORIN GU IRRIGATION 4 ML/1000 ML NS"
      },
      {
        "INDEX": 6402,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 8:54:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BUPIVACAINE LIPOSOME",
        "ORDER_MNEMONIC": "BUPIVACAINE LIPOSOME 1.3 % IJ SUSP"
      },
      {
        "INDEX": 6403,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 10:25:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MEPERIDINE HCL",
        "ORDER_MNEMONIC": "MEPERIDINE HCL 25 MG/ML IJ SOLN"
      },
      {
        "INDEX": 6404,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 2:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LEVOTHYROXINE SODIUM",
        "ORDER_MNEMONIC": "LEVOTHYROXINE SODIUM 112 MCG PO TABS"
      },
      {
        "INDEX": 6405,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 2:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 6406,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 2:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPHENIDATE HCL",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 6407,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/14/2015 10:53:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ACETAMINOPHEN",
        "ORDER_MNEMONIC": "ACETAMINOPHEN 325 MG PO TABS"
      },
      {
        "INDEX": 6408,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/14/2015 10:53:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRAMADOL HCL",
        "ORDER_MNEMONIC": "TRAMADOL HCL 50 MG PO TABS"
      },
      {
        "INDEX": 6409,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/14/2015 10:53:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MAGNESIUM HYDROXIDE",
        "ORDER_MNEMONIC": "MAGNESIUM HYDROXIDE 400 MG/5ML PO SUSP"
      },
      {
        "INDEX": 6410,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/14/2015 10:53:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SENNOSIDES",
        "ORDER_MNEMONIC": "SENNA 8.6 MG PO TABS"
      },
      {
        "INDEX": 6411,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/14/2015 10:53:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 6412,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/14/2015 11:22:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "INFLUENZA VAC SPLIT QUAD",
        "ORDER_MNEMONIC": "INFLUENZA VAC SPLIT QUAD 0.5 ML IM SUSY"
      },
      {
        "INDEX": 6413,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/14/2015 10:53:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CYCLOBENZAPRINE HCL",
        "ORDER_MNEMONIC": "CYCLOBENZAPRINE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 6414,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/14/2015 10:53:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "NAPROXEN",
        "ORDER_MNEMONIC": "NAPROXEN 500 MG PO TABS"
      },
      {
        "INDEX": 6415,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/14/2015 10:47:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PREGABALIN",
        "ORDER_MNEMONIC": "PREGABALIN 150 MG PO CAPS"
      },
      {
        "INDEX": 6416,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/14/2015 10:53:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ASPIRIN",
        "ORDER_MNEMONIC": "ASPIRIN 81 MG PO CHEW"
      },
      {
        "INDEX": 6417,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 2:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "OXYCODONE IR ORAL RANGE RECORD"
      },
      {
        "INDEX": 6418,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 2:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRAMADOL HCL",
        "ORDER_MNEMONIC": "TRAMADOL HCL 50 MG PO TABS"
      },
      {
        "INDEX": 6419,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/14/2015 10:47:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LEVOTHYROXINE SODIUM",
        "ORDER_MNEMONIC": "LEVOTHYROXINE SODIUM 100 MCG PO TABS"
      },
      {
        "INDEX": 6420,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 2:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SENNOSIDES",
        "ORDER_MNEMONIC": "SENNA 8.6 MG PO TABS"
      },
      {
        "INDEX": 6421,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 2:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "NAPROXEN",
        "ORDER_MNEMONIC": "NAPROXEN 500 MG PO TABS"
      },
      {
        "INDEX": 6422,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 2:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ATORVASTATIN CALCIUM",
        "ORDER_MNEMONIC": "ATORVASTATIN CALCIUM 10 MG PO TABS"
      },
      {
        "INDEX": 6423,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/14/2015 10:49:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PREGABALIN",
        "ORDER_MNEMONIC": "PREGABALIN 75 MG PO CAPS"
      },
      {
        "INDEX": 6424,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 2:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ACETAMINOPHEN",
        "ORDER_MNEMONIC": "ACETAMINOPHEN 325 MG PO TABS"
      },
      {
        "INDEX": 6425,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/14/2015 3:34:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CALCIUM CARBONATE ANTACID",
        "ORDER_MNEMONIC": "CALCIUM CARBONATE ANTACID 500 MG PO CHEW"
      },
      {
        "INDEX": 6426,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 2:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ASPIRIN",
        "ORDER_MNEMONIC": "ASPIRIN 81 MG PO CHEW"
      },
      {
        "INDEX": 6427,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 2:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METFORMIN HCL",
        "ORDER_MNEMONIC": "METFORMIN HCL 500 MG PO TABS"
      },
      {
        "INDEX": 6428,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 2:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "HYDROMORPHONE INJ DOSE RANGE RECORD"
      },
      {
        "INDEX": 6429,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 2:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MAGNESIUM OXIDE",
        "ORDER_MNEMONIC": "MAGNESIUM OXIDE 400 (241.3 MG) MG PO TABS"
      },
      {
        "INDEX": 6430,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 2:10:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LISINOPRIL",
        "ORDER_MNEMONIC": "LISINOPRIL 10 MG PO TABS"
      },
      {
        "INDEX": 6431,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/14/2015 10:47:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ATORVASTATIN CALCIUM",
        "ORDER_MNEMONIC": "ATORVASTATIN CALCIUM 10 MG PO TABS"
      },
      {
        "INDEX": 6432,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/14/2015 12:30:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "OT EVAL AND TREAT",
        "ORDER_MNEMONIC": "OT EVAL AND TREAT"
      },
      {
        "INDEX": 6433,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/15/2015 3:01:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "INFLUENZA VAC SPLIT QUAD",
        "ORDER_MNEMONIC": "INFLUENZA VAC SPLIT QUAD 0.5 ML IM SUSY"
      },
      {
        "INDEX": 6434,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 8:27:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 6435,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 7:56:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "SPINAL ANESTHESIA"
      },
      {
        "INDEX": 6436,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 7:44:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRANEXAMIC ACID",
        "ORDER_MNEMONIC": "TRANEXAMIC ACID 100 MG/ML IV SOLN"
      },
      {
        "INDEX": 6437,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 7:58:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "PROPOFOL INFUSION INTRA-OP SIM"
      },
      {
        "INDEX": 6438,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 7:41:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FENTANYL CITRATE",
        "ORDER_MNEMONIC": "FENTANYL CITRATE 0.05 MG/ML IJ SOLN"
      },
      {
        "INDEX": 6439,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 7:41:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MIDAZOLAM HCL",
        "ORDER_MNEMONIC": "MIDAZOLAM HCL 2 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 6440,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 7:46:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "LACTATED RINGERS IV BOLUS"
      },
      {
        "INDEX": 6441,
        "PAT_ID": 20559329,
        "VISIT_NO": 205206094,
        "ORDER_DTM": "10/13/2015 7:43:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "PROPOFOL INFUSION INTRA-OP SIM"
      },
      {
        "INDEX": 6442,
        "PAT_ID": 20559329,
        "VISIT_NO": 206889338,
        "ORDER_DTM": "8/11/2015 1:41:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CEPHALEXIN",
        "ORDER_MNEMONIC": "CEPHALEXIN 500 MG PO CAPS"
      },
      {
        "INDEX": 6443,
        "PAT_ID": 20559329,
        "VISIT_NO": 207416881,
        "ORDER_DTM": "9/8/2015 3:46:00 PM",
        "ORDER_STATUS": "SUSPEND",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CLINDAMYCIN HCL",
        "ORDER_MNEMONIC": "CLINDAMYCIN HCL 300 MG PO CAPS"
      },
      {
        "INDEX": 6444,
        "PAT_ID": 20559329,
        "VISIT_NO": 208284791,
        "ORDER_DTM": "10/29/2015 3:30:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "APPL MODALITY 1/> AREAS ELEC STIMJ UNATTENDED",
        "ORDER_MNEMONIC": "ELECTRIC STIMULATION THERAPY"
      },
      {
        "INDEX": 6445,
        "PAT_ID": 20559329,
        "VISIT_NO": 208284791,
        "ORDER_DTM": "10/29/2015 3:31:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PT MEDICARE PLAN OF CARE CERT/RE-CERT",
        "ORDER_MNEMONIC": "PT MEDICARE PLAN OF CARE CERT/RE-CERT"
      },
      {
        "INDEX": 6446,
        "PAT_ID": 20559329,
        "VISIT_NO": 208284791,
        "ORDER_DTM": "10/29/2015 3:30:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PHYSICAL THERAPY EVALUATION",
        "ORDER_MNEMONIC": "PHYS THERAPY EVALUATION"
      },
      {
        "INDEX": 6447,
        "PAT_ID": 20559329,
        "VISIT_NO": 208284838,
        "ORDER_DTM": "11/3/2015 12:44:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6448,
        "PAT_ID": 20559329,
        "VISIT_NO": 208284915,
        "ORDER_DTM": "11/5/2015 1:03:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6449,
        "PAT_ID": 20559329,
        "VISIT_NO": 208284915,
        "ORDER_DTM": "11/5/2015 1:03:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "MANUAL THERAPY TQS 1/> REGIONS EACH 15 MINUTES",
        "ORDER_MNEMONIC": "MANUAL THER TECH,1+REGIONS,EA 15 MIN"
      },
      {
        "INDEX": 6450,
        "PAT_ID": 20559329,
        "VISIT_NO": 208303857,
        "ORDER_DTM": "10/26/2015 12:15:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MAGNESIUM OXIDE",
        "ORDER_MNEMONIC": "MAGNESIUM 400 MG PO CAPS"
      },
      {
        "INDEX": 6451,
        "PAT_ID": 20559329,
        "VISIT_NO": 208303857,
        "ORDER_DTM": "10/26/2015 12:20:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DIPHENHYDRAMINE-APAP (SLEEP)",
        "ORDER_MNEMONIC": "DIPHENHYDRAMINE-APAP (SLEEP) 25-500 MG PO TABS"
      },
      {
        "INDEX": 6452,
        "PAT_ID": 20559329,
        "VISIT_NO": 208303857,
        "ORDER_DTM": "10/26/2015 12:20:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 6453,
        "PAT_ID": 20559329,
        "VISIT_NO": 208303857,
        "ORDER_DTM": "10/26/2015 12:20:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SENNOSIDES",
        "ORDER_MNEMONIC": "SENNA 8.6 MG PO TABS"
      },
      {
        "INDEX": 6454,
        "PAT_ID": 20559329,
        "VISIT_NO": 208303857,
        "ORDER_DTM": "10/26/2015 12:20:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "NAPROXEN",
        "ORDER_MNEMONIC": "NAPROXEN 500 MG PO TABS"
      },
      {
        "INDEX": 6455,
        "PAT_ID": 20559329,
        "VISIT_NO": 208303857,
        "ORDER_DTM": "10/26/2015 12:20:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LANSOPRAZOLE",
        "ORDER_MNEMONIC": "LANSOPRAZOLE 30 MG PO CPDR"
      },
      {
        "INDEX": 6456,
        "PAT_ID": 20559329,
        "VISIT_NO": 208303857,
        "ORDER_DTM": "10/26/2015 12:20:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRAMADOL HCL",
        "ORDER_MNEMONIC": "TRAMADOL HCL 50 MG PO TABS"
      },
      {
        "INDEX": 6457,
        "PAT_ID": 20559329,
        "VISIT_NO": 208570551,
        "ORDER_DTM": "11/18/2015 5:58:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6458,
        "PAT_ID": 20559329,
        "VISIT_NO": 208570551,
        "ORDER_DTM": "11/18/2015 5:58:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "MANUAL THERAPY TQS 1/> REGIONS EACH 15 MINUTES",
        "ORDER_MNEMONIC": "MANUAL THER TECH,1+REGIONS,EA 15 MIN"
      },
      {
        "INDEX": 6459,
        "PAT_ID": 20559329,
        "VISIT_NO": 208715087,
        "ORDER_DTM": "11/25/2015 10:29:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6460,
        "PAT_ID": 20559329,
        "VISIT_NO": 208715087,
        "ORDER_DTM": "11/25/2015 10:29:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "APPL MODALITY 1/> AREAS ELEC STIMJ UNATTENDED",
        "ORDER_MNEMONIC": "ELECTRIC STIMULATION THERAPY"
      },
      {
        "INDEX": 6461,
        "PAT_ID": 20559329,
        "VISIT_NO": 208715147,
        "ORDER_DTM": "12/4/2015 10:19:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6462,
        "PAT_ID": 20559329,
        "VISIT_NO": 208715149,
        "ORDER_DTM": "12/10/2015 11:46:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6463,
        "PAT_ID": 20559329,
        "VISIT_NO": 208715149,
        "ORDER_DTM": "12/10/2015 11:46:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "MANUAL THERAPY TQS 1/> REGIONS EACH 15 MINUTES",
        "ORDER_MNEMONIC": "MANUAL THER TECH,1+REGIONS,EA 15 MIN"
      },
      {
        "INDEX": 6464,
        "PAT_ID": 20559329,
        "VISIT_NO": 208718977,
        "ORDER_DTM": "11/9/2015 9:57:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6465,
        "PAT_ID": 20559329,
        "VISIT_NO": 208718977,
        "ORDER_DTM": "11/9/2015 9:57:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "MANUAL THERAPY TQS 1/> REGIONS EACH 15 MINUTES",
        "ORDER_MNEMONIC": "MANUAL THER TECH,1+REGIONS,EA 15 MIN"
      },
      {
        "INDEX": 6466,
        "PAT_ID": 20559329,
        "VISIT_NO": 208965539,
        "ORDER_DTM": "12/17/2015 11:53:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6467,
        "PAT_ID": 20559329,
        "VISIT_NO": 208965549,
        "ORDER_DTM": "12/24/2015 12:11:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6468,
        "PAT_ID": 20559329,
        "VISIT_NO": 208965588,
        "ORDER_DTM": "12/31/2015 12:17:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6469,
        "PAT_ID": 20559329,
        "VISIT_NO": 208965588,
        "ORDER_DTM": "12/31/2015 12:17:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "MANUAL THERAPY TQS 1/> REGIONS EACH 15 MINUTES",
        "ORDER_MNEMONIC": "MANUAL THER TECH,1+REGIONS,EA 15 MIN"
      },
      {
        "INDEX": 6470,
        "PAT_ID": 20559329,
        "VISIT_NO": 208965600,
        "ORDER_DTM": "1/7/2016 12:39:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6471,
        "PAT_ID": 20559329,
        "VISIT_NO": 208965617,
        "ORDER_DTM": "1/21/2016 12:27:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6472,
        "PAT_ID": 20559329,
        "VISIT_NO": 208965617,
        "ORDER_DTM": "1/21/2016 12:27:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "MANUAL THERAPY TQS 1/> REGIONS EACH 15 MINUTES",
        "ORDER_MNEMONIC": "MANUAL THER TECH,1+REGIONS,EA 15 MIN"
      },
      {
        "INDEX": 6473,
        "PAT_ID": 20559329,
        "VISIT_NO": 208983747,
        "ORDER_DTM": "11/18/2015 3:10:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "RANITIDINE HCL",
        "ORDER_MNEMONIC": "RANITIDINE HCL 150 MG PO TABS"
      },
      {
        "INDEX": 6474,
        "PAT_ID": 20559329,
        "VISIT_NO": 208983747,
        "ORDER_DTM": "11/18/2015 2:11:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MELOXICAM",
        "ORDER_MNEMONIC": "MELOXICAM 15 MG PO TABS"
      },
      {
        "INDEX": 6475,
        "PAT_ID": 20559329,
        "VISIT_NO": 208983747,
        "ORDER_DTM": "11/18/2015 3:10:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRIAMCINOLONE ACETONIDE",
        "ORDER_MNEMONIC": "TRIAMCINOLONE ACETONIDE 0.1 % EX LOTN"
      },
      {
        "INDEX": 6476,
        "PAT_ID": 20559329,
        "VISIT_NO": 208983747,
        "ORDER_DTM": "11/18/2015 2:11:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ACETAMINOPHEN-CODEINE",
        "ORDER_MNEMONIC": "ACETAMINOPHEN-CODEINE #3 300-30 MG PO TABS"
      },
      {
        "INDEX": 6477,
        "PAT_ID": 20559329,
        "VISIT_NO": 208983831,
        "ORDER_DTM": "11/18/2015 12:41:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Levothyroxine Sodium",
        "ORDER_MNEMONIC": "LEVOTHYROXINE SODIUM 112 MCG PO TABLET"
      },
      {
        "INDEX": 6478,
        "PAT_ID": 20559329,
        "VISIT_NO": 209467038,
        "ORDER_DTM": "12/17/2015 4:51:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRAMADOL HCL",
        "ORDER_MNEMONIC": "TRAMADOL HCL 50 MG PO TABS"
      },
      {
        "INDEX": 6479,
        "PAT_ID": 20559329,
        "VISIT_NO": 209679873,
        "ORDER_DTM": "1/28/2016 3:11:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6480,
        "PAT_ID": 20559329,
        "VISIT_NO": 209679873,
        "ORDER_DTM": "1/28/2016 3:11:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6481,
        "PAT_ID": 20559329,
        "VISIT_NO": 209679873,
        "ORDER_DTM": "1/28/2016 3:10:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PT MEDICARE PLAN OF CARE CERT/RE-CERT",
        "ORDER_MNEMONIC": "PT MEDICARE PLAN OF CARE CERT/RE-CERT"
      },
      {
        "INDEX": 6482,
        "PAT_ID": 20559329,
        "VISIT_NO": 210324107,
        "ORDER_DTM": "1/28/2016 1:38:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Atorvastatin Calcium",
        "ORDER_MNEMONIC": "ATORVASTATIN CALCIUM 10 MG PO TABLET"
      },
      {
        "INDEX": 6483,
        "PAT_ID": 20559329,
        "VISIT_NO": 210357149,
        "ORDER_DTM": "2/8/2016 3:33:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPHENIDATE HCL",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABS"
      },
      {
        "INDEX": 6484,
        "PAT_ID": 20559329,
        "VISIT_NO": 210357149,
        "ORDER_DTM": "2/8/2016 3:33:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Terbinafine HCl",
        "ORDER_MNEMONIC": "TERBINAFINE HCL 250 MG PO TABLET"
      },
      {
        "INDEX": 6485,
        "PAT_ID": 20559329,
        "VISIT_NO": 210357149,
        "ORDER_DTM": "2/8/2016 3:33:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPHENIDATE HCL",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABS"
      },
      {
        "INDEX": 6486,
        "PAT_ID": 20559329,
        "VISIT_NO": 210357149,
        "ORDER_DTM": "2/8/2016 3:33:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PRAMIPEXOLE DIHYDROCHLORIDE",
        "ORDER_MNEMONIC": "PRAMIPEXOLE DIHYDROCHLORIDE 0.125 MG PO TABS"
      },
      {
        "INDEX": 6487,
        "PAT_ID": 20559329,
        "VISIT_NO": 210357149,
        "ORDER_DTM": "2/8/2016 3:33:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPHENIDATE HCL",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABS"
      },
      {
        "INDEX": 6488,
        "PAT_ID": 20559329,
        "VISIT_NO": 210357149,
        "ORDER_DTM": "2/8/2016 3:33:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "FOOT EXAMINATION PERFORMED",
        "ORDER_MNEMONIC": "FOOT EXAM PERFORMED"
      },
      {
        "INDEX": 6489,
        "PAT_ID": 20559329,
        "VISIT_NO": 210525065,
        "ORDER_DTM": "2/5/2016 5:12:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Cephalexin",
        "ORDER_MNEMONIC": "CEPHALEXIN 500 MG PO CAPS"
      },
      {
        "INDEX": 6490,
        "PAT_ID": 20559329,
        "VISIT_NO": 210995818,
        "ORDER_DTM": "2/29/2016 8:35:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MetFORMIN HCl",
        "ORDER_MNEMONIC": "METFORMIN HCL 500 MG PO TABLET"
      },
      {
        "INDEX": 6491,
        "PAT_ID": 20559329,
        "VISIT_NO": 211302431,
        "ORDER_DTM": "3/29/2016 10:35:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPHENIDATE HCL",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABS"
      },
      {
        "INDEX": 6492,
        "PAT_ID": 20559329,
        "VISIT_NO": 211302431,
        "ORDER_DTM": "3/29/2016 10:35:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPHENIDATE HCL",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABS"
      },
      {
        "INDEX": 6493,
        "PAT_ID": 20559329,
        "VISIT_NO": 211302431,
        "ORDER_DTM": "3/29/2016 10:35:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPHENIDATE HCL",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABS"
      },
      {
        "INDEX": 6494,
        "PAT_ID": 20559329,
        "VISIT_NO": 211374974,
        "ORDER_DTM": "3/29/2016 10:37:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Pregabalin",
        "ORDER_MNEMONIC": "PREGABALIN 150 MG PO CAPS"
      },
      {
        "INDEX": 6495,
        "PAT_ID": 20559329,
        "VISIT_NO": 211770308,
        "ORDER_DTM": "4/1/2016 9:46:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Methylphenidate HCl",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABLET"
      },
      {
        "INDEX": 6496,
        "PAT_ID": 20559329,
        "VISIT_NO": 211770308,
        "ORDER_DTM": "4/1/2016 9:46:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPHENIDATE HCL",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABS"
      },
      {
        "INDEX": 6497,
        "PAT_ID": 20559329,
        "VISIT_NO": 211770308,
        "ORDER_DTM": "4/1/2016 9:46:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPHENIDATE HCL",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABS"
      },
      {
        "INDEX": 6498,
        "PAT_ID": 20559329,
        "VISIT_NO": 212029577,
        "ORDER_DTM": "4/18/2016 10:40:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "IBUPROFEN",
        "ORDER_MNEMONIC": "IBUPROFEN 800 MG PO TABS"
      },
      {
        "INDEX": 6499,
        "PAT_ID": 20559329,
        "VISIT_NO": 212029577,
        "ORDER_DTM": "4/18/2016 11:02:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "RaNITidine HCl",
        "ORDER_MNEMONIC": "RANITIDINE HCL 150 MG PO TABLET"
      },
      {
        "INDEX": 6500,
        "PAT_ID": 20559329,
        "VISIT_NO": 212029577,
        "ORDER_DTM": "4/18/2016 11:07:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Citalopram Hydrobromide",
        "ORDER_MNEMONIC": "CITALOPRAM HYDROBROMIDE 20 MG PO TABLET"
      },
      {
        "INDEX": 6501,
        "PAT_ID": 20559329,
        "VISIT_NO": 212121592,
        "ORDER_DTM": "5/4/2016 1:51:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "MANUAL THERAPY TQS 1/> REGIONS EACH 15 MINUTES",
        "ORDER_MNEMONIC": "MANUAL THER TECH,1+REGIONS,EA 15 MIN"
      },
      {
        "INDEX": 6502,
        "PAT_ID": 20559329,
        "VISIT_NO": 212121592,
        "ORDER_DTM": "5/4/2016 1:51:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6503,
        "PAT_ID": 20559329,
        "VISIT_NO": 212332630,
        "ORDER_DTM": "4/27/2016 1:40:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6504,
        "PAT_ID": 20559329,
        "VISIT_NO": 212332630,
        "ORDER_DTM": "4/27/2016 2:51:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PT MEDICARE PLAN OF CARE CERT/RE-CERT",
        "ORDER_MNEMONIC": "PT MEDICARE PLAN OF CARE CERT/RE-CERT"
      },
      {
        "INDEX": 6505,
        "PAT_ID": 20559329,
        "VISIT_NO": 212332630,
        "ORDER_DTM": "4/27/2016 1:40:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PHYSICAL THERAPY EVALUATION",
        "ORDER_MNEMONIC": "PHYS THERAPY EVALUATION"
      },
      {
        "INDEX": 6506,
        "PAT_ID": 20559329,
        "VISIT_NO": 212589942,
        "ORDER_DTM": "5/11/2016 1:49:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Pramipexole Dihydrochloride",
        "ORDER_MNEMONIC": "PRAMIPEXOLE DIHYDROCHLORIDE 0.125 MG PO TABLET"
      },
      {
        "INDEX": 6507,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:36:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METFORMIN HCL",
        "ORDER_MNEMONIC": "METFORMIN HCL 500 MG PO TABS"
      },
      {
        "INDEX": 6508,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 8:11:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SODIUM CHLORIDE (GU IRRIGANT)",
        "ORDER_MNEMONIC": "SODIUM CHLORIDE 0.9 % IR SOLN"
      },
      {
        "INDEX": 6509,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:40:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DEXTROSE",
        "ORDER_MNEMONIC": "DEXTROSE 50 % IV SOLN"
      },
      {
        "INDEX": 6510,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 3:32:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "BLOCK"
      },
      {
        "INDEX": 6511,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:40:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "NALBUPHINE HCL",
        "ORDER_MNEMONIC": "NALBUPHINE HCL 10 MG/ML IJ SOLN"
      },
      {
        "INDEX": 6512,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:40:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BISACODYL",
        "ORDER_MNEMONIC": "BISACODYL 10 MG RE SUPP"
      },
      {
        "INDEX": 6513,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 11:08:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MIDAZOLAM HCL",
        "ORDER_MNEMONIC": "MIDAZOLAM HCL 2 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 6514,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:36:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CITALOPRAM HYDROBROMIDE",
        "ORDER_MNEMONIC": "CITALOPRAM HYDROBROMIDE 20 MG PO TABS"
      },
      {
        "INDEX": 6515,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:36:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPHENIDATE HCL",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABS"
      },
      {
        "INDEX": 6516,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:36:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PRAMIPEXOLE DIHYDROCHLORIDE",
        "ORDER_MNEMONIC": "PRAMIPEXOLE DIHYDROCHLORIDE 0.125 MG PO TABS"
      },
      {
        "INDEX": 6517,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 11:08:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HALOPERIDOL LACTATE",
        "ORDER_MNEMONIC": "HALOPERIDOL LACTATE 5 MG/ML IJ SOLN"
      },
      {
        "INDEX": 6518,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 11:08:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ALBUTEROL SULFATE",
        "ORDER_MNEMONIC": "ALBUTEROL SULFATE (5 MG/ML) 0.5% IN NEBU"
      },
      {
        "INDEX": 6519,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 1:21:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "BUPIVACAINE 1/10% (1 MG/ML) 250 ML DOSI-FUSOR (OMNICELL)"
      },
      {
        "INDEX": 6520,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:40:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "CEFAZOLIN 1000 MG IV SYRINGE (OMNICELL)"
      },
      {
        "INDEX": 6521,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:36:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "RANITIDINE HCL",
        "ORDER_MNEMONIC": "RANITIDINE HCL 150 MG PO TABS"
      },
      {
        "INDEX": 6522,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:36:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TERBINAFINE HCL",
        "ORDER_MNEMONIC": "TERBINAFINE HCL 250 MG PO TABS"
      },
      {
        "INDEX": 6523,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 8:25:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ACETAMINOPHEN",
        "ORDER_MNEMONIC": "ACETAMINOPHEN 325 MG PO TABS"
      },
      {
        "INDEX": 6524,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:36:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ATORVASTATIN CALCIUM",
        "ORDER_MNEMONIC": "ATORVASTATIN CALCIUM 20 MG PO TABS"
      },
      {
        "INDEX": 6525,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 11:25:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OMEPRAZOLE",
        "ORDER_MNEMONIC": "OMEPRAZOLE 20 MG PO CPDR"
      },
      {
        "INDEX": 6526,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:40:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MAGNESIUM HYDROXIDE",
        "ORDER_MNEMONIC": "MAGNESIUM HYDROXIDE 400 MG/5ML PO SUSP"
      },
      {
        "INDEX": 6527,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:40:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "HYDROMORPHONE INJ DOSE RANGE RECORD"
      },
      {
        "INDEX": 6528,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:36:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "ZZ IMS (NEVER ORDER OR DELETE) RXD 1010"
      },
      {
        "INDEX": 6529,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:36:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LISINOPRIL",
        "ORDER_MNEMONIC": "LISINOPRIL 10 MG PO TABS"
      },
      {
        "INDEX": 6530,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:40:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BISACODYL",
        "ORDER_MNEMONIC": "BISACODYL 5 MG PO TBEC"
      },
      {
        "INDEX": 6531,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 11:08:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "FENTANYL CITRATE 0.05 MG/ML IJ SOLN MASTER ERX"
      },
      {
        "INDEX": 6532,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 11:08:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LACTATED RINGERS",
        "ORDER_MNEMONIC": "LACTATED RINGERS IV SOLN"
      },
      {
        "INDEX": 6533,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 11:08:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROMORPHONE HCL",
        "ORDER_MNEMONIC": "HYDROMORPHONE HCL 1 MG/ML IJ SOLN"
      },
      {
        "INDEX": 6534,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 11:08:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LABETALOL HCL",
        "ORDER_MNEMONIC": "LABETALOL HCL 5 MG/ML IV SOLN"
      },
      {
        "INDEX": 6535,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 11:08:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 6536,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:40:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 6537,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:40:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRAMADOL HCL",
        "ORDER_MNEMONIC": "TRAMADOL HCL 50 MG PO TABS"
      },
      {
        "INDEX": 6538,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:40:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG PO TABS"
      },
      {
        "INDEX": 6539,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/23/2016 7:14:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 6540,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/23/2016 7:17:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Aspirin",
        "ORDER_MNEMONIC": "ASPIRIN 81 MG PO CHEW"
      },
      {
        "INDEX": 6541,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:36:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN",
        "ORDER_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN 5-325 MG PO TABS"
      },
      {
        "INDEX": 6542,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:40:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "POLYETHYLENE GLYCOL 3350",
        "ORDER_MNEMONIC": "POLYETHYLENE GLYCOL 3350 PO PACK"
      },
      {
        "INDEX": 6543,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/23/2016 7:17:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 6544,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/23/2016 7:17:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TraMADol HCl",
        "ORDER_MNEMONIC": "TRAMADOL HCL 50 MG PO TABLET"
      },
      {
        "INDEX": 6545,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:36:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PREGABALIN",
        "ORDER_MNEMONIC": "PREGABALIN 75 MG PO CAPS"
      },
      {
        "INDEX": 6546,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/23/2016 8:54:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 6547,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/23/2016 6:05:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DIPHENHYDRAMINE HCL",
        "ORDER_MNEMONIC": "DIPHENHYDRAMINE HCL 25 MG PO CAPS"
      },
      {
        "INDEX": 6548,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:40:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "INSULIN REGULAR HUMAN",
        "ORDER_MNEMONIC": "INSULIN REGULAR HUMAN  100 UNIT/ML IJ SOLN"
      },
      {
        "INDEX": 6549,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:40:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SENNOSIDES",
        "ORDER_MNEMONIC": "SENNA 8.6 MG PO TABS"
      },
      {
        "INDEX": 6550,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/23/2016 7:14:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ACETAMINOPHEN",
        "ORDER_MNEMONIC": "ACETAMINOPHEN 325 MG PO TABS"
      },
      {
        "INDEX": 6551,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 12:40:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ASPIRIN",
        "ORDER_MNEMONIC": "ASPIRIN 81 MG PO CHEW"
      },
      {
        "INDEX": 6552,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 9:14:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "AIRWAY"
      },
      {
        "INDEX": 6553,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 9:11:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CEFAZOLIN SODIUM",
        "ORDER_MNEMONIC": "CEFAZOLIN SODIUM 1 G POWDER IJ SOLR"
      },
      {
        "INDEX": 6554,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 9:16:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "FENTANYL CITRATE 0.05 MG/ML IJ SOLN MASTER ERX"
      },
      {
        "INDEX": 6555,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 9:16:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "PROPOFOL10 MG/ML IV EMUL MASTER-ERX"
      },
      {
        "INDEX": 6556,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 9:16:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 6557,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 9:16:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LIDOCAINE HCL",
        "ORDER_MNEMONIC": "LIDOCAINE HCL (PF) 4 % IJ SOLN"
      },
      {
        "INDEX": 6558,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 9:16:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "EPHEDRINE SULFATE (PRESSORS)",
        "ORDER_MNEMONIC": "EPHEDRINE SULFATE 50 MG/ML IJ SOLN"
      },
      {
        "INDEX": 6559,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 9:16:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "LACTATED RINGERS IV BOLUS"
      },
      {
        "INDEX": 6560,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 9:15:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MIDAZOLAM HCL",
        "ORDER_MNEMONIC": "MIDAZOLAM HCL 2 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 6561,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 9:16:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SUCCINYLCHOLINE CHLORIDE",
        "ORDER_MNEMONIC": "SUCCINYLCHOLINE CHLORIDE 20 MG/ML IJ SOLN"
      },
      {
        "INDEX": 6562,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 9:16:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "PROPOFOL W/REMIFENTANIL INFUSION OP-TIME"
      },
      {
        "INDEX": 6563,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 10:40:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROMORPHONE HCL",
        "ORDER_MNEMONIC": "HYDROMORPHONE HCL 1 MG/ML IJ SOLN"
      },
      {
        "INDEX": 6564,
        "PAT_ID": 20559329,
        "VISIT_NO": 212682475,
        "ORDER_DTM": "6/22/2016 9:16:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DEXAMETHASONE SODIUM PHOSPHATE",
        "ORDER_MNEMONIC": "DEXAMETHASONE SOD PHOSPHATE PF 10 MG/ML IJ SOLN"
      },
      {
        "INDEX": 6565,
        "PAT_ID": 20559329,
        "VISIT_NO": 214056937,
        "ORDER_DTM": "7/13/2016 8:58:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OxyCODONE HCl",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABLET"
      },
      {
        "INDEX": 6566,
        "PAT_ID": 20559329,
        "VISIT_NO": 214443173,
        "ORDER_DTM": "8/8/2016 8:43:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Lansoprazole",
        "ORDER_MNEMONIC": "LANSOPRAZOLE 30 MG PO CPDR"
      },
      {
        "INDEX": 6567,
        "PAT_ID": 20559329,
        "VISIT_NO": 215236104,
        "ORDER_DTM": "9/6/2016 8:06:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Lisinopril",
        "ORDER_MNEMONIC": "LISINOPRIL 10 MG PO TABLET"
      },
      {
        "INDEX": 6568,
        "PAT_ID": 20559329,
        "VISIT_NO": 216522623,
        "ORDER_DTM": "12/30/2016 11:11:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Methylphenidate HCl",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABLET"
      },
      {
        "INDEX": 6569,
        "PAT_ID": 20559329,
        "VISIT_NO": 216522623,
        "ORDER_DTM": "12/30/2016 11:11:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Methylphenidate HCl",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABLET"
      },
      {
        "INDEX": 6570,
        "PAT_ID": 20559329,
        "VISIT_NO": 216522623,
        "ORDER_DTM": "12/30/2016 11:06:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MetFORMIN HCl",
        "ORDER_MNEMONIC": "METFORMIN HCL 500 MG PO TABLET"
      },
      {
        "INDEX": 6571,
        "PAT_ID": 20559329,
        "VISIT_NO": 216522623,
        "ORDER_DTM": "12/30/2016 11:06:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Lansoprazole",
        "ORDER_MNEMONIC": "LANSOPRAZOLE 30 MG PO CPDR"
      },
      {
        "INDEX": 6572,
        "PAT_ID": 20559329,
        "VISIT_NO": 216522623,
        "ORDER_DTM": "12/30/2016 11:06:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Pramipexole Dihydrochloride",
        "ORDER_MNEMONIC": "PRAMIPEXOLE DIHYDROCHLORIDE 0.125 MG PO TABLET"
      },
      {
        "INDEX": 6573,
        "PAT_ID": 20559329,
        "VISIT_NO": 216522623,
        "ORDER_DTM": "12/30/2016 11:09:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Methylphenidate HCl",
        "ORDER_MNEMONIC": "METHYLPHENIDATE HCL 10 MG PO TABLET"
      },
      {
        "INDEX": 6574,
        "PAT_ID": 20559329,
        "VISIT_NO": 216522623,
        "ORDER_DTM": "12/30/2016 11:06:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Lisinopril",
        "ORDER_MNEMONIC": "LISINOPRIL 20 MG PO TABLET"
      },
      {
        "INDEX": 6575,
        "PAT_ID": 20559329,
        "VISIT_NO": 216522623,
        "ORDER_DTM": "12/30/2016 11:06:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Citalopram Hydrobromide",
        "ORDER_MNEMONIC": "CITALOPRAM HYDROBROMIDE 20 MG PO TABLET"
      },
      {
        "INDEX": 6576,
        "PAT_ID": 20559329,
        "VISIT_NO": 216522623,
        "ORDER_DTM": "12/30/2016 11:06:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "RaNITidine HCl",
        "ORDER_MNEMONIC": "RANITIDINE HCL 150 MG PO TABLET"
      },
      {
        "INDEX": 6577,
        "PAT_ID": 20559329,
        "VISIT_NO": 216522623,
        "ORDER_DTM": "12/30/2016 11:06:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Pregabalin",
        "ORDER_MNEMONIC": "PREGABALIN 150 MG PO CAPS"
      },
      {
        "INDEX": 6578,
        "PAT_ID": 20559329,
        "VISIT_NO": 216522623,
        "ORDER_DTM": "12/30/2016 11:06:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Atorvastatin Calcium",
        "ORDER_MNEMONIC": "ATORVASTATIN CALCIUM 10 MG PO TABLET"
      },
      {
        "INDEX": 6579,
        "PAT_ID": 20559329,
        "VISIT_NO": 216543518,
        "ORDER_DTM": "12/2/2016 11:39:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6580,
        "PAT_ID": 20559329,
        "VISIT_NO": 216543518,
        "ORDER_DTM": "12/2/2016 11:39:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PHYSICAL THERAPY EVALUATION",
        "ORDER_MNEMONIC": "PHYS THERAPY EVALUATION"
      },
      {
        "INDEX": 6581,
        "PAT_ID": 20559329,
        "VISIT_NO": 216543518,
        "ORDER_DTM": "1/27/2017 2:19:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PT MEDICARE PLAN OF CARE CERT/RE-CERT",
        "ORDER_MNEMONIC": "PT MEDICARE PLAN OF CARE CERT/RE-CERT"
      },
      {
        "INDEX": 6582,
        "PAT_ID": 20559329,
        "VISIT_NO": 216543574,
        "ORDER_DTM": "12/13/2016 1:09:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6583,
        "PAT_ID": 20559329,
        "VISIT_NO": 216543655,
        "ORDER_DTM": "12/28/2016 11:00:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "MANUAL THERAPY TQS 1/> REGIONS EACH 15 MINUTES",
        "ORDER_MNEMONIC": "MANUAL THER TECH,1+REGIONS,EA 15 MIN"
      },
      {
        "INDEX": 6584,
        "PAT_ID": 20559329,
        "VISIT_NO": 216543655,
        "ORDER_DTM": "12/28/2016 11:00:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6585,
        "PAT_ID": 20559329,
        "VISIT_NO": 216866412,
        "ORDER_DTM": "11/16/2016 3:29:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Lansoprazole",
        "ORDER_MNEMONIC": "LANSOPRAZOLE 30 MG PO CPDR"
      },
      {
        "INDEX": 6586,
        "PAT_ID": 20559329,
        "VISIT_NO": 217234974,
        "ORDER_DTM": "1/13/2017 3:10:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6587,
        "PAT_ID": 20559329,
        "VISIT_NO": 217234974,
        "ORDER_DTM": "1/13/2017 3:10:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "MANUAL THERAPY TQS 1/> REGIONS EACH 15 MINUTES",
        "ORDER_MNEMONIC": "MANUAL THER TECH,1+REGIONS,EA 15 MIN"
      },
      {
        "INDEX": 6588,
        "PAT_ID": 20559329,
        "VISIT_NO": 217234975,
        "ORDER_DTM": "1/17/2017 3:45:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6589,
        "PAT_ID": 20559329,
        "VISIT_NO": 217234976,
        "ORDER_DTM": "1/27/2017 3:27:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6590,
        "PAT_ID": 20559329,
        "VISIT_NO": 217576236,
        "ORDER_DTM": "12/19/2016 1:12:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Levothyroxine Sodium",
        "ORDER_MNEMONIC": "LEVOTHYROXINE SODIUM 112 MCG PO TABLET"
      },
      {
        "INDEX": 6591,
        "PAT_ID": 20559329,
        "VISIT_NO": 217774958,
        "ORDER_DTM": "2/2/2017 3:37:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6592,
        "PAT_ID": 20559329,
        "VISIT_NO": 217774959,
        "ORDER_DTM": "2/9/2017 3:35:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6593,
        "PAT_ID": 20559329,
        "VISIT_NO": 217774959,
        "ORDER_DTM": "2/9/2017 3:36:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PT MEDICARE PLAN OF CARE CERT/RE-CERT",
        "ORDER_MNEMONIC": "PT MEDICARE PLAN OF CARE CERT/RE-CERT"
      },
      {
        "INDEX": 6594,
        "PAT_ID": 20559329,
        "VISIT_NO": 218101264,
        "ORDER_DTM": "1/12/2017 3:02:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "AmLODIPine Besylate",
        "ORDER_MNEMONIC": "AMLODIPINE BESYLATE 5 MG PO TABLET"
      },
      {
        "INDEX": 6595,
        "PAT_ID": 20559329,
        "VISIT_NO": 218560683,
        "ORDER_DTM": "2/7/2017 3:05:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FentaNYL Citrate",
        "ORDER_MNEMONIC": "FENTANYL CITRATE 0.05 MG/ML IJ SOLN MASTER ERX"
      },
      {
        "INDEX": 6596,
        "PAT_ID": 20559329,
        "VISIT_NO": 218560683,
        "ORDER_DTM": "2/7/2017 2:44:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Sodium Chloride",
        "ORDER_MNEMONIC": "SODIUM CHLORIDE 0.9 % IV SOLN"
      },
      {
        "INDEX": 6597,
        "PAT_ID": 20559329,
        "VISIT_NO": 218560683,
        "ORDER_DTM": "2/7/2017 3:07:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Propofol",
        "ORDER_MNEMONIC": "PROPOFOL10 MG/ML IV EMUL MASTER-ERX"
      },
      {
        "INDEX": 6598,
        "PAT_ID": 20559329,
        "VISIT_NO": 218560683,
        "ORDER_DTM": "2/7/2017 3:32:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Sodium Chloride",
        "ORDER_MNEMONIC": "SODIUM CHLORIDE 0.9 % IV BOLUS"
      },
      {
        "INDEX": 6599,
        "PAT_ID": 20559329,
        "VISIT_NO": 218560683,
        "ORDER_DTM": "2/7/2017 2:44:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "COLONOSCOPY"
      },
      {
        "INDEX": 6600,
        "PAT_ID": 20559329,
        "VISIT_NO": 218580760,
        "ORDER_DTM": "2/1/2017 9:15:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Lisinopril",
        "ORDER_MNEMONIC": "LISINOPRIL 20 MG PO TABLET"
      },
      {
        "INDEX": 6601,
        "PAT_ID": 20559329,
        "VISIT_NO": 218580760,
        "ORDER_DTM": "2/1/2017 9:15:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Levothyroxine Sodium",
        "ORDER_MNEMONIC": "LEVOTHYROXINE SODIUM 112 MCG PO TABLET"
      },
      {
        "INDEX": 6602,
        "PAT_ID": 20559329,
        "VISIT_NO": 218605405,
        "ORDER_DTM": "2/1/2017 4:51:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Ferrous Sulfate",
        "ORDER_MNEMONIC": "FERROUS SULFATE 325 (65 FE) MG PO TABLET"
      },
      {
        "INDEX": 6603,
        "PAT_ID": 20559329,
        "VISIT_NO": 218632598,
        "ORDER_DTM": "3/6/2017 4:46:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6604,
        "PAT_ID": 20559329,
        "VISIT_NO": 218632599,
        "ORDER_DTM": "3/13/2017 3:29:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 6605,
        "PAT_ID": 20559329,
        "VISIT_NO": 218632599,
        "ORDER_DTM": "3/13/2017 3:29:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "LASER THERAPY TREATMENT, PT"
      }
    ],
    10557320: [
      {
        "INDEX": 713651,
        "PAT_ID": 10557320,
        "VISIT_NO": 0,
        "ORDER_DTM": "8/8/2016",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "GASTROCNEMIUS RECESSION",
        "ORDER_MNEMONIC": "GASTROCNEMIUS RECESSION"
      },
      {
        "INDEX": 713652,
        "PAT_ID": 10557320,
        "VISIT_NO": 0,
        "ORDER_DTM": "8/8/2016",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "RPR PRIM DISRUPTED LIGM ANKLE BTH COLTRL LIGMS",
        "ORDER_MNEMONIC": "REPAIR BOTH COLLAT ANKL LIGMT,PRIMRY"
      },
      {
        "INDEX": 713653,
        "PAT_ID": 10557320,
        "VISIT_NO": 0,
        "ORDER_DTM": "8/8/2016",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "TR/TRNSPL 1 TDN W/MUSC REDIRION/REROUTING DP",
        "ORDER_MNEMONIC": "XFER SINGLE DEEP LOW LEG TENDON"
      },
      {
        "INDEX": 713654,
        "PAT_ID": 10557320,
        "VISIT_NO": 0,
        "ORDER_DTM": "8/8/2016",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "RPR PRIMARY DISRUPTED LIGAMENT ANKLE COLLATERAL",
        "ORDER_MNEMONIC": "REPAIR 1 COLLAT ANKLE LIGMNT,PRIMARY"
      },
      {
        "INDEX": 713720,
        "PAT_ID": 10557320,
        "VISIT_NO": 0,
        "ORDER_DTM": "8/8/2016",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "REPAIR SECONDARY DISRUPTED LIGAMENT ANKLE COLTRL",
        "ORDER_MNEMONIC": "REPAIR COLLAT ANKLE LIGMNT,SECONDARY"
      },
      {
        "INDEX": 713929,
        "PAT_ID": 10557320,
        "VISIT_NO": 195207082,
        "ORDER_DTM": "10/3/2013 3:13:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "KETOCONAZOLE",
        "ORDER_MNEMONIC": "KETOCONAZOLE 1 % EX SHAM"
      },
      {
        "INDEX": 713930,
        "PAT_ID": 10557320,
        "VISIT_NO": 195207082,
        "ORDER_DTM": "10/3/2013 3:37:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "KETOCONAZOLE",
        "ORDER_MNEMONIC": "KETOCONAZOLE 2 % EX SHAM"
      },
      {
        "INDEX": 713931,
        "PAT_ID": 10557320,
        "VISIT_NO": 195466543,
        "ORDER_DTM": "12/11/2013 12:00:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MIDAZOLAM HCL",
        "ORDER_MNEMONIC": "MIDAZOLAM HCL 2 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 713932,
        "PAT_ID": 10557320,
        "VISIT_NO": 195466543,
        "ORDER_DTM": "12/11/2013 1:00:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BUPIVACAINE HCL",
        "ORDER_MNEMONIC": "BUPIVACAINE HCL 0.25 % IJ SOLN"
      },
      {
        "INDEX": 713933,
        "PAT_ID": 10557320,
        "VISIT_NO": 195466543,
        "ORDER_DTM": "12/11/2013 12:00:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LIDOCAINE HCL",
        "ORDER_MNEMONIC": "LIDOCAINE HCL 2 % IJ SOLN"
      },
      {
        "INDEX": 713934,
        "PAT_ID": 10557320,
        "VISIT_NO": 195466543,
        "ORDER_DTM": "12/11/2013 3:22:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FENTANYL CITRATE",
        "ORDER_MNEMONIC": "FENTANYL CITRATE 0.05 MG/ML IJ SOLN"
      },
      {
        "INDEX": 713935,
        "PAT_ID": 10557320,
        "VISIT_NO": 195468106,
        "ORDER_DTM": "10/22/2013 2:55:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713936,
        "PAT_ID": 10557320,
        "VISIT_NO": 195769205,
        "ORDER_DTM": "12/20/2013 1:20:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713937,
        "PAT_ID": 10557320,
        "VISIT_NO": 195769205,
        "ORDER_DTM": "12/20/2013 1:20:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713938,
        "PAT_ID": 10557320,
        "VISIT_NO": 195867803,
        "ORDER_DTM": "11/19/2013 4:48:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713939,
        "PAT_ID": 10557320,
        "VISIT_NO": 195867803,
        "ORDER_DTM": "11/19/2013 4:48:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713940,
        "PAT_ID": 10557320,
        "VISIT_NO": 196175070,
        "ORDER_DTM": "12/18/2013 4:27:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CLOBETASOL PROPIONATE",
        "ORDER_MNEMONIC": "CLOBETASOL PROPIONATE 0.05 % EX SOLN"
      },
      {
        "INDEX": 713941,
        "PAT_ID": 10557320,
        "VISIT_NO": 196175070,
        "ORDER_DTM": "12/18/2013 4:27:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRETINOIN",
        "ORDER_MNEMONIC": "TRETINOIN 0.025 % EX CREA"
      },
      {
        "INDEX": 713942,
        "PAT_ID": 10557320,
        "VISIT_NO": 196643319,
        "ORDER_DTM": "1/17/2014 12:56:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713943,
        "PAT_ID": 10557320,
        "VISIT_NO": 196643319,
        "ORDER_DTM": "1/17/2014 12:56:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713944,
        "PAT_ID": 10557320,
        "VISIT_NO": 197076083,
        "ORDER_DTM": "2/18/2014 11:24:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713945,
        "PAT_ID": 10557320,
        "VISIT_NO": 197076083,
        "ORDER_DTM": "2/18/2014 11:24:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713946,
        "PAT_ID": 10557320,
        "VISIT_NO": 197578773,
        "ORDER_DTM": "3/21/2014 10:22:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713947,
        "PAT_ID": 10557320,
        "VISIT_NO": 197661464,
        "ORDER_DTM": "3/28/2014 3:22:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713948,
        "PAT_ID": 10557320,
        "VISIT_NO": 197661464,
        "ORDER_DTM": "3/28/2014 3:22:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713949,
        "PAT_ID": 10557320,
        "VISIT_NO": 197661464,
        "ORDER_DTM": "3/28/2014 3:30:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713950,
        "PAT_ID": 10557320,
        "VISIT_NO": 197661464,
        "ORDER_DTM": "3/28/2014 3:30:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713951,
        "PAT_ID": 10557320,
        "VISIT_NO": 199793947,
        "ORDER_DTM": "9/12/2014 3:03:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713952,
        "PAT_ID": 10557320,
        "VISIT_NO": 200470955,
        "ORDER_DTM": "10/24/2014 2:02:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713953,
        "PAT_ID": 10557320,
        "VISIT_NO": 200470955,
        "ORDER_DTM": "10/24/2014 2:02:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713954,
        "PAT_ID": 10557320,
        "VISIT_NO": 200471031,
        "ORDER_DTM": "10/15/2014 1:31:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "DSTR NROLYTC AGNT PARVERTEB FCT SNGL LMBR/SACRAL",
        "ORDER_MNEMONIC": "DSTR NROLYTC AGNT PARVERTEB FCT SNGL LMBR/SACRAL"
      },
      {
        "INDEX": 713955,
        "PAT_ID": 10557320,
        "VISIT_NO": 200471031,
        "ORDER_DTM": "10/15/2014 11:35:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BUPIVACAINE HCL",
        "ORDER_MNEMONIC": "BUPIVACAINE HCL 0.25 % IJ SOLN"
      },
      {
        "INDEX": 713956,
        "PAT_ID": 10557320,
        "VISIT_NO": 200471031,
        "ORDER_DTM": "10/15/2014 11:35:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPREDNISOLONE ACETATE",
        "ORDER_MNEMONIC": "METHYLPREDNISOLONE ACETATE 40 MG/ML IJ SUSP"
      },
      {
        "INDEX": 713957,
        "PAT_ID": 10557320,
        "VISIT_NO": 201011555,
        "ORDER_DTM": "10/13/2014 1:51:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ESOMEPRAZOLE MAGNESIUM",
        "ORDER_MNEMONIC": "NEXIUM 20 MG PO CPDR"
      },
      {
        "INDEX": 713958,
        "PAT_ID": 10557320,
        "VISIT_NO": 201348620,
        "ORDER_DTM": "11/14/2014 1:54:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713959,
        "PAT_ID": 10557320,
        "VISIT_NO": 201348620,
        "ORDER_DTM": "11/14/2014 1:54:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713960,
        "PAT_ID": 10557320,
        "VISIT_NO": 201348620,
        "ORDER_DTM": "11/14/2014 1:54:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713961,
        "PAT_ID": 10557320,
        "VISIT_NO": 201348620,
        "ORDER_DTM": "11/14/2014 1:54:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713962,
        "PAT_ID": 10557320,
        "VISIT_NO": 202028438,
        "ORDER_DTM": "12/3/2014 7:38:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FLUTICASONE PROPIONATE",
        "ORDER_MNEMONIC": "FLUTICASONE PROPIONATE 50 MCG/ACT NA SUSP"
      },
      {
        "INDEX": 713963,
        "PAT_ID": 10557320,
        "VISIT_NO": 205154366,
        "ORDER_DTM": "6/12/2015 11:37:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713964,
        "PAT_ID": 10557320,
        "VISIT_NO": 205154366,
        "ORDER_DTM": "6/12/2015 11:37:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713965,
        "PAT_ID": 10557320,
        "VISIT_NO": 205154366,
        "ORDER_DTM": "6/12/2015 11:37:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713966,
        "PAT_ID": 10557320,
        "VISIT_NO": 205243802,
        "ORDER_DTM": "5/15/2015 2:39:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "12 LEAD ECG (EKG)",
        "ORDER_MNEMONIC": "12 LEAD ECG (EKG)"
      },
      {
        "INDEX": 713967,
        "PAT_ID": 10557320,
        "VISIT_NO": 205243802,
        "ORDER_DTM": "5/15/2015 3:16:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713968,
        "PAT_ID": 10557320,
        "VISIT_NO": 205243802,
        "ORDER_DTM": "5/15/2015 3:17:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CYCLOBENZAPRINE HCL",
        "ORDER_MNEMONIC": "CYCLOBENZAPRINE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713969,
        "PAT_ID": 10557320,
        "VISIT_NO": 206570379,
        "ORDER_DTM": "8/5/2015 2:20:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ESOMEPRAZOLE MAGNESIUM",
        "ORDER_MNEMONIC": "ESOMEPRAZOLE MAGNESIUM 20 MG PO CPDR"
      },
      {
        "INDEX": 713970,
        "PAT_ID": 10557320,
        "VISIT_NO": 206886327,
        "ORDER_DTM": "8/11/2015 1:13:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713971,
        "PAT_ID": 10557320,
        "VISIT_NO": 206986935,
        "ORDER_DTM": "8/16/2015 7:42:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 713972,
        "PAT_ID": 10557320,
        "VISIT_NO": 206986935,
        "ORDER_DTM": "8/16/2015 10:34:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "POLYETHYLENE GLYCOL 3350",
        "ORDER_MNEMONIC": "POLYETHYLENE GLYCOL 3350 PO PACK"
      },
      {
        "INDEX": 713973,
        "PAT_ID": 10557320,
        "VISIT_NO": 207427914,
        "ORDER_DTM": "9/8/2015 2:14:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713974,
        "PAT_ID": 10557320,
        "VISIT_NO": 207427914,
        "ORDER_DTM": "9/8/2015 2:14:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713975,
        "PAT_ID": 10557320,
        "VISIT_NO": 208112552,
        "ORDER_DTM": "10/7/2015 3:49:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713976,
        "PAT_ID": 10557320,
        "VISIT_NO": 208112552,
        "ORDER_DTM": "10/7/2015 3:49:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713977,
        "PAT_ID": 10557320,
        "VISIT_NO": 208711856,
        "ORDER_DTM": "11/5/2015 3:32:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713978,
        "PAT_ID": 10557320,
        "VISIT_NO": 209033454,
        "ORDER_DTM": "11/20/2015 9:06:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713979,
        "PAT_ID": 10557320,
        "VISIT_NO": 213358082,
        "ORDER_DTM": "6/9/2016 4:45:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "POLYETHYLENE GLYCOL 3350",
        "ORDER_MNEMONIC": "POLYETHYLENE GLYCOL 3350 PO POWD"
      },
      {
        "INDEX": 713980,
        "PAT_ID": 10557320,
        "VISIT_NO": 213412958,
        "ORDER_DTM": "6/17/2016 12:48:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SULFAMETHOXAZOLE-TRIMETHOPRIM",
        "ORDER_MNEMONIC": "SULFAMETHOXAZOLE-TRIMETHOPRIM 800-160 MG PO TABS"
      },
      {
        "INDEX": 713981,
        "PAT_ID": 10557320,
        "VISIT_NO": 213558164,
        "ORDER_DTM": "6/20/2016 2:06:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713982,
        "PAT_ID": 10557320,
        "VISIT_NO": 213558164,
        "ORDER_DTM": "6/20/2016 2:06:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713983,
        "PAT_ID": 10557320,
        "VISIT_NO": 213577537,
        "ORDER_DTM": "6/24/2016 11:27:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713984,
        "PAT_ID": 10557320,
        "VISIT_NO": 213577537,
        "ORDER_DTM": "6/24/2016 11:27:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713985,
        "PAT_ID": 10557320,
        "VISIT_NO": 213884844,
        "ORDER_DTM": "7/13/2016 2:00:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "RANITIDINE HCL",
        "ORDER_MNEMONIC": "RANITIDINE HCL 150 MG PO TABLET"
      },
      {
        "INDEX": 713986,
        "PAT_ID": 10557320,
        "VISIT_NO": 214146042,
        "ORDER_DTM": "7/18/2016 11:54:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713987,
        "PAT_ID": 10557320,
        "VISIT_NO": 214146042,
        "ORDER_DTM": "7/18/2016 11:54:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PANTOPRAZOLE SODIUM",
        "ORDER_MNEMONIC": "PANTOPRAZOLE SODIUM 40 MG PO TBEC"
      },
      {
        "INDEX": 713988,
        "PAT_ID": 10557320,
        "VISIT_NO": 214146042,
        "ORDER_DTM": "7/18/2016 12:20:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 713989,
        "PAT_ID": 10557320,
        "VISIT_NO": 214166238,
        "ORDER_DTM": "7/21/2016 10:11:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ESOMEPRAZOLE MAGNESIUM",
        "ORDER_MNEMONIC": "NEXIUM 20 MG PO CPDR"
      },
      {
        "INDEX": 713990,
        "PAT_ID": 10557320,
        "VISIT_NO": 214172699,
        "ORDER_DTM": "7/20/2016 11:38:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DEXLANSOPRAZOLE",
        "ORDER_MNEMONIC": "DEXLANSOPRAZOLE 60 MG PO CPDR"
      },
      {
        "INDEX": 713991,
        "PAT_ID": 10557320,
        "VISIT_NO": 214279038,
        "ORDER_DTM": "7/27/2016 4:39:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 713992,
        "PAT_ID": 10557320,
        "VISIT_NO": 214279038,
        "ORDER_DTM": "8/3/2016 4:04:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PT MEDICARE PLAN OF CARE CERT/RE-CERT",
        "ORDER_MNEMONIC": "PT MEDICARE PLAN OF CARE CERT/RE-CERT"
      },
      {
        "INDEX": 713993,
        "PAT_ID": 10557320,
        "VISIT_NO": 214418764,
        "ORDER_DTM": "8/1/2016 3:32:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRETINOIN",
        "ORDER_MNEMONIC": "TRETINOIN 0.05 % EX CREA"
      },
      {
        "INDEX": 713994,
        "PAT_ID": 10557320,
        "VISIT_NO": 214474321,
        "ORDER_DTM": "8/3/2016 1:14:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 713995,
        "PAT_ID": 10557320,
        "VISIT_NO": 214474321,
        "ORDER_DTM": "8/3/2016 1:14:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "APPL MODALITY 1/> AREAS ELEC STIMJ UNATTENDED",
        "ORDER_MNEMONIC": "ELECTRIC STIMULATION THERAPY"
      },
      {
        "INDEX": 714063,
        "PAT_ID": 10557320,
        "VISIT_NO": 195466543,
        "ORDER_DTM": "12/11/2013 1:00:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPREDNISOLONE ACETATE",
        "ORDER_MNEMONIC": "METHYLPREDNISOLONE ACETATE 40 MG/ML IJ SUSP"
      },
      {
        "INDEX": 714064,
        "PAT_ID": 10557320,
        "VISIT_NO": 195468106,
        "ORDER_DTM": "10/22/2013 2:55:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 714065,
        "PAT_ID": 10557320,
        "VISIT_NO": 197578773,
        "ORDER_DTM": "3/21/2014 10:22:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 714066,
        "PAT_ID": 10557320,
        "VISIT_NO": 197661464,
        "ORDER_DTM": "3/28/2014 3:22:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 714067,
        "PAT_ID": 10557320,
        "VISIT_NO": 197661464,
        "ORDER_DTM": "3/28/2014 3:22:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 714068,
        "PAT_ID": 10557320,
        "VISIT_NO": 199793947,
        "ORDER_DTM": "9/12/2014 3:03:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 714069,
        "PAT_ID": 10557320,
        "VISIT_NO": 200043785,
        "ORDER_DTM": "8/25/2014 10:52:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 714070,
        "PAT_ID": 10557320,
        "VISIT_NO": 200043785,
        "ORDER_DTM": "8/25/2014 10:52:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 714071,
        "PAT_ID": 10557320,
        "VISIT_NO": 200471031,
        "ORDER_DTM": "10/15/2014 11:35:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LIDOCAINE HCL",
        "ORDER_MNEMONIC": "LIDOCAINE HCL 2 % IJ SOLN"
      },
      {
        "INDEX": 714072,
        "PAT_ID": 10557320,
        "VISIT_NO": 205154366,
        "ORDER_DTM": "6/12/2015 11:37:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 714073,
        "PAT_ID": 10557320,
        "VISIT_NO": 205243802,
        "ORDER_DTM": "5/15/2015 3:16:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 714074,
        "PAT_ID": 10557320,
        "VISIT_NO": 205291525,
        "ORDER_DTM": "5/21/2015 1:25:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "ECHO EXERCISE STRESS",
        "ORDER_MNEMONIC": "ECHO EXERCISE STRESS"
      },
      {
        "INDEX": 714075,
        "PAT_ID": 10557320,
        "VISIT_NO": 206886327,
        "ORDER_DTM": "8/11/2015 1:13:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 714076,
        "PAT_ID": 10557320,
        "VISIT_NO": 206986935,
        "ORDER_DTM": "8/16/2015 7:42:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "NITROGLYCERIN",
        "ORDER_MNEMONIC": "NITROGLYCERIN 0.4 MG SL SUBL"
      },
      {
        "INDEX": 714077,
        "PAT_ID": 10557320,
        "VISIT_NO": 206986935,
        "ORDER_DTM": "8/16/2015 7:35:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "12 LEAD ECG (EKG)",
        "ORDER_MNEMONIC": "12 LEAD ECG (EKG)"
      },
      {
        "INDEX": 714078,
        "PAT_ID": 10557320,
        "VISIT_NO": 206986935,
        "ORDER_DTM": "8/16/2015 7:42:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ASPIRIN",
        "ORDER_MNEMONIC": "ASPIRIN 81 MG PO CHEW"
      },
      {
        "INDEX": 714079,
        "PAT_ID": 10557320,
        "VISIT_NO": 206986935,
        "ORDER_DTM": "8/16/2015 8:44:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "KETOROLAC TROMETHAMINE",
        "ORDER_MNEMONIC": "KETOROLAC TROMETHAMINE 30 MG/ML IJ SOLN"
      },
      {
        "INDEX": 714080,
        "PAT_ID": 10557320,
        "VISIT_NO": 206986935,
        "ORDER_DTM": "8/16/2015 7:42:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SODIUM CHLORIDE",
        "ORDER_MNEMONIC": "SODIUM CHLORIDE 0.9 % IV SOLN"
      },
      {
        "INDEX": 714081,
        "PAT_ID": 10557320,
        "VISIT_NO": 209033454,
        "ORDER_DTM": "11/20/2015 9:06:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 714082,
        "PAT_ID": 10557320,
        "VISIT_NO": 213358082,
        "ORDER_DTM": "6/9/2016 4:45:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ESOMEPRAZOLE MAGNESIUM",
        "ORDER_MNEMONIC": "ESOMEPRAZOLE MAGNESIUM 20 MG PO CPDR"
      },
      {
        "INDEX": 714083,
        "PAT_ID": 10557320,
        "VISIT_NO": 213358082,
        "ORDER_DTM": "6/9/2016 4:45:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SENNOSIDES",
        "ORDER_MNEMONIC": "SENNA 8.6 MG PO TABS"
      },
      {
        "INDEX": 714084,
        "PAT_ID": 10557320,
        "VISIT_NO": 213558164,
        "ORDER_DTM": "6/20/2016 8:08:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CIPROFLOXACIN HCL",
        "ORDER_MNEMONIC": "CIPROFLOXACIN HCL 500 MG PO TABS"
      },
      {
        "INDEX": 714085,
        "PAT_ID": 10557320,
        "VISIT_NO": 213804223,
        "ORDER_DTM": "7/11/2016 1:16:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ESOMEPRAZOLE MAGNESIUM",
        "ORDER_MNEMONIC": "NEXIUM PO"
      },
      {
        "INDEX": 714086,
        "PAT_ID": 10557320,
        "VISIT_NO": 214146042,
        "ORDER_DTM": "7/18/2016 11:54:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 714087,
        "PAT_ID": 10557320,
        "VISIT_NO": 214166238,
        "ORDER_DTM": "7/21/2016 10:39:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "NAPROXEN",
        "ORDER_MNEMONIC": "NAPROXEN 500 MG PO TABS"
      },
      {
        "INDEX": 714088,
        "PAT_ID": 10557320,
        "VISIT_NO": 214279038,
        "ORDER_DTM": "7/27/2016 4:39:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PHYSICAL THERAPY EVALUATION",
        "ORDER_MNEMONIC": "PHYS THERAPY EVALUATION"
      },
      {
        "INDEX": 714089,
        "PAT_ID": 10557320,
        "VISIT_NO": 214314343,
        "ORDER_DTM": "8/1/2016 11:47:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "KETOCONAZOLE",
        "ORDER_MNEMONIC": "KETOCONAZOLE 1 % EX SHAM"
      },
      {
        "INDEX": 714090,
        "PAT_ID": 10557320,
        "VISIT_NO": 214418764,
        "ORDER_DTM": "8/1/2016 3:32:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CLOBETASOL PROPIONATE",
        "ORDER_MNEMONIC": "CLOBETASOL PROPIONATE 0.05 % EX SOLN"
      },
      {
        "INDEX": 714091,
        "PAT_ID": 10557320,
        "VISIT_NO": 214653562,
        "ORDER_DTM": "8/10/2016 3:39:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHADONE HCL",
        "ORDER_MNEMONIC": "METHADONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 714092,
        "PAT_ID": 10557320,
        "VISIT_NO": 214653562,
        "ORDER_DTM": "8/10/2016 3:39:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      }
    ],
    19634716: [
      {
        "INDEX": 586198,
        "PAT_ID": 19634716,
        "VISIT_NO": 0,
        "ORDER_DTM": "10/17/2013",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "ARTHROCENTESIS ASPIR&/INJ MAJOR JT/BURSA W/O US",
        "ORDER_MNEMONIC": "DRAIN/INJECT LARGE JOINT/BURSA"
      },
      {
        "INDEX": 586199,
        "PAT_ID": 19634716,
        "VISIT_NO": 196123522,
        "ORDER_DTM": "12/16/2013 3:15:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRAMADOL HCL",
        "ORDER_MNEMONIC": "TRAMADOL HCL 50 MG PO TABS"
      },
      {
        "INDEX": 586200,
        "PAT_ID": 19634716,
        "VISIT_NO": 196337704,
        "ORDER_DTM": "12/29/2013 2:16:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRAMADOL HCL",
        "ORDER_MNEMONIC": "TRAMADOL HCL 50 MG PO TABS"
      },
      {
        "INDEX": 586201,
        "PAT_ID": 19634716,
        "VISIT_NO": 196880353,
        "ORDER_DTM": "2/3/2014 8:15:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE-ACETAMINOPHEN",
        "ORDER_MNEMONIC": "OXYCODONE-ACETAMINOPHEN 7.5-325 MG PO TABS"
      },
      {
        "INDEX": 586202,
        "PAT_ID": 19634716,
        "VISIT_NO": 197298889,
        "ORDER_DTM": "3/5/2014 6:23:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN",
        "ORDER_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN 5-325 MG PO TABS"
      },
      {
        "INDEX": 586203,
        "PAT_ID": 19634716,
        "VISIT_NO": 197435571,
        "ORDER_DTM": "3/17/2014 5:08:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROMORPHONE HCL",
        "ORDER_MNEMONIC": "HYDROMORPHONE HCL 2 MG PO TABS"
      },
      {
        "INDEX": 586204,
        "PAT_ID": 19634716,
        "VISIT_NO": 197837254,
        "ORDER_DTM": "4/8/2014 10:42:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN",
        "ORDER_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN 5-325 MG PO TABS"
      },
      {
        "INDEX": 586205,
        "PAT_ID": 19634716,
        "VISIT_NO": 198198720,
        "ORDER_DTM": "4/30/2014 2:19:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN",
        "ORDER_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN 5-325 MG PO TABS"
      },
      {
        "INDEX": 586206,
        "PAT_ID": 19634716,
        "VISIT_NO": 198436534,
        "ORDER_DTM": "5/18/2014 3:06:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN",
        "ORDER_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN 5-325 MG PO TABS"
      },
      {
        "INDEX": 586207,
        "PAT_ID": 19634716,
        "VISIT_NO": 198802587,
        "ORDER_DTM": "6/19/2014 2:51:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LIDOCAINE HCL",
        "ORDER_MNEMONIC": "LIDOCAINE HCL 1 % IJ SOLN"
      },
      {
        "INDEX": 586208,
        "PAT_ID": 19634716,
        "VISIT_NO": 198802587,
        "ORDER_DTM": "6/19/2014 2:51:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRIAMCINOLONE ACETONIDE",
        "ORDER_MNEMONIC": "TRIAMCINOLONE ACETONIDE 40 MG/ML IJ SUSP"
      },
      {
        "INDEX": 586209,
        "PAT_ID": 19634716,
        "VISIT_NO": 198886963,
        "ORDER_DTM": "6/14/2014 4:39:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN",
        "ORDER_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN 5-325 MG PO TABS"
      },
      {
        "INDEX": 586210,
        "PAT_ID": 19634716,
        "VISIT_NO": 200155490,
        "ORDER_DTM": "9/18/2014 11:31:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "NAPROXEN",
        "ORDER_MNEMONIC": "NAPROXEN 250 MG PO TABS"
      },
      {
        "INDEX": 586211,
        "PAT_ID": 19634716,
        "VISIT_NO": 200568272,
        "ORDER_DTM": "10/9/2014 2:57:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CALCIUM CARBONATE-VITAMIN D",
        "ORDER_MNEMONIC": "CALCIUM CARBONATE-VITAMIN D 600-400 MG-UNIT PO TABS"
      },
      {
        "INDEX": 586212,
        "PAT_ID": 19634716,
        "VISIT_NO": 201246803,
        "ORDER_DTM": "11/3/2014 4:43:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "ARTHROCENTESIS ASPIR&/INJECTION MAJOR JT/BURSA",
        "ORDER_MNEMONIC": "DRAIN/INJECT LARGE JOINT/BURSA"
      },
      {
        "INDEX": 586213,
        "PAT_ID": 19634716,
        "VISIT_NO": 201246803,
        "ORDER_DTM": "11/3/2014 4:43:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPREDNISOLONE ACETATE",
        "ORDER_MNEMONIC": "METHYLPREDNISOLONE ACETATE 40 MG/ML IJ SUSP"
      },
      {
        "INDEX": 586214,
        "PAT_ID": 19634716,
        "VISIT_NO": 205172521,
        "ORDER_DTM": "5/29/2015 3:58:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MELOXICAM",
        "ORDER_MNEMONIC": "MELOXICAM 15 MG PO TABS"
      },
      {
        "INDEX": 586215,
        "PAT_ID": 19634716,
        "VISIT_NO": 205521502,
        "ORDER_DTM": "6/19/2015 1:38:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MELOXICAM",
        "ORDER_MNEMONIC": "MELOXICAM 15 MG PO TABS"
      },
      {
        "INDEX": 586397,
        "PAT_ID": 19634716,
        "VISIT_NO": 0,
        "ORDER_DTM": "9/19/2014",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "ARTHROCENTESIS ASPIR&/INJECTION MAJOR JT/BURSA",
        "ORDER_MNEMONIC": "DRAIN/INJECT LARGE JOINT/BURSA"
      },
      {
        "INDEX": 586398,
        "PAT_ID": 19634716,
        "VISIT_NO": 196880353,
        "ORDER_DTM": "2/4/2014 7:19:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE-ACETAMINOPHEN",
        "ORDER_MNEMONIC": "OXYCODONE-ACETAMINOPHEN 7.5-325 MG PO TABS"
      },
      {
        "INDEX": 586399,
        "PAT_ID": 19634716,
        "VISIT_NO": 196983118,
        "ORDER_DTM": "3/10/2014 4:15:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE-ACETAMINOPHEN",
        "ORDER_MNEMONIC": "OXYCODONE-ACETAMINOPHEN 5-325 MG PO TABS"
      },
      {
        "INDEX": 586400,
        "PAT_ID": 19634716,
        "VISIT_NO": 197549388,
        "ORDER_DTM": "3/23/2014 2:49:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TAPENTADOL HCL",
        "ORDER_MNEMONIC": "TAPENTADOL HCL 75 MG PO TABS"
      },
      {
        "INDEX": 586401,
        "PAT_ID": 19634716,
        "VISIT_NO": 198802587,
        "ORDER_DTM": "6/23/2014 8:37:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "ARTHROCENTESIS ASPIR&/INJECTION MAJOR JT/BURSA",
        "ORDER_MNEMONIC": "DRAIN/INJECT LARGE JOINT/BURSA"
      },
      {
        "INDEX": 586402,
        "PAT_ID": 19634716,
        "VISIT_NO": 201246803,
        "ORDER_DTM": "11/3/2014 4:43:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ROPIVACAINE HCL",
        "ORDER_MNEMONIC": "ROPIVACAINE HCL 2 MG/ML IJ SOLN"
      },
      {
        "INDEX": 586403,
        "PAT_ID": 19634716,
        "VISIT_NO": 205172521,
        "ORDER_DTM": "5/29/2015 2:38:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRAMADOL HCL",
        "ORDER_MNEMONIC": "TRAMADOL HCL 50 MG PO TABS"
      },
      {
        "INDEX": 586743,
        "PAT_ID": 19634716,
        "VISIT_NO": 212259674,
        "ORDER_DTM": "4/24/2016 2:52:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "AZITHROMYCIN",
        "ORDER_MNEMONIC": "AZITHROMYCIN 250 MG PO TABS"
      },
      {
        "INDEX": 586744,
        "PAT_ID": 19634716,
        "VISIT_NO": 212259674,
        "ORDER_DTM": "4/24/2016 8:18:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "AZITHROMYCIN",
        "ORDER_MNEMONIC": "AZITHROMYCIN 250 MG PO TABS"
      },
      {
        "INDEX": 586745,
        "PAT_ID": 19634716,
        "VISIT_NO": 212259674,
        "ORDER_DTM": "4/24/2016 2:17:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRAMADOL HCL",
        "ORDER_MNEMONIC": "TRAMADOL HCL 50 MG PO TABS"
      },
      {
        "INDEX": 586746,
        "PAT_ID": 19634716,
        "VISIT_NO": 212259674,
        "ORDER_DTM": "4/24/2016 2:17:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON",
        "ORDER_MNEMONIC": "ONDANSETRON 4 MG PO TBDP"
      },
      {
        "INDEX": 586747,
        "PAT_ID": 19634716,
        "VISIT_NO": 212259674,
        "ORDER_DTM": "4/24/2016 2:17:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "ZZ IMS (NEVER ORDER OR DELETE) RXD 1010"
      },
      {
        "INDEX": 586748,
        "PAT_ID": 19634716,
        "VISIT_NO": 212259674,
        "ORDER_DTM": "4/24/2016 2:17:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "IPRATROPIUM BROMIDE",
        "ORDER_MNEMONIC": "IPRATROPIUM BROMIDE 0.02 % IN SOLN"
      },
      {
        "INDEX": 586749,
        "PAT_ID": 19634716,
        "VISIT_NO": 212259674,
        "ORDER_DTM": "4/23/2016 11:19:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "SODIUM CHLORIDE 0.9 % IV BOLUS"
      },
      {
        "INDEX": 586750,
        "PAT_ID": 19634716,
        "VISIT_NO": 212259674,
        "ORDER_DTM": "4/23/2016 10:02:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SODIUM CHLORIDE",
        "ORDER_MNEMONIC": "SODIUM CHLORIDE 0.9 % IV SOLN"
      },
      {
        "INDEX": 586751,
        "PAT_ID": 19634716,
        "VISIT_NO": 212259674,
        "ORDER_DTM": "4/24/2016 2:17:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ACETAMINOPHEN",
        "ORDER_MNEMONIC": "ACETAMINOPHEN 325 MG PO TABS"
      },
      {
        "INDEX": 586752,
        "PAT_ID": 19634716,
        "VISIT_NO": 212259674,
        "ORDER_DTM": "4/24/2016 2:17:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ALBUTEROL SULFATE",
        "ORDER_MNEMONIC": "ALBUTEROL SULFATE (5 MG/ML) 0.5% IN NEBU"
      },
      {
        "INDEX": 586909,
        "PAT_ID": 19634716,
        "VISIT_NO": 212259674,
        "ORDER_DTM": "4/24/2016 8:21:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "AZITHROMYCIN",
        "ORDER_MNEMONIC": "AZITHROMYCIN 250 MG PO TABS"
      },
      {
        "INDEX": 586910,
        "PAT_ID": 19634716,
        "VISIT_NO": 212259674,
        "ORDER_DTM": "4/23/2016 10:02:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "12 LEAD ECG (EKG)",
        "ORDER_MNEMONIC": "12 LEAD ECG (EKG)"
      },
      {
        "INDEX": 586911,
        "PAT_ID": 19634716,
        "VISIT_NO": 212259674,
        "ORDER_DTM": "4/24/2016 1:45:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "MAGNESIUM SULFATE 2 G IN 50 ML NS (OMNICELL)"
      }
    ],
    12061313: [
      {
        "INDEX": 683288,
        "PAT_ID": 12061313,
        "VISIT_NO": 0,
        "ORDER_DTM": "2/25/2014",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "NEEDLE EMG GUID W/CHEMODENERVATION",
        "ORDER_MNEMONIC": "NEEDLE EMG GUIDANCE FOR CHEMODENERVATION"
      },
      {
        "INDEX": 683289,
        "PAT_ID": 12061313,
        "VISIT_NO": 0,
        "ORDER_DTM": "2/25/2014",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "CHEMODNRVTJ MUSC MUSC INNERVATED FACIAL NRV UNIL",
        "ORDER_MNEMONIC": "DEST,NERVE,FACIAL"
      },
      {
        "INDEX": 683290,
        "PAT_ID": 12061313,
        "VISIT_NO": 0,
        "ORDER_DTM": "2/25/2014",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "CHEMODENERVATION MUSCLE LARYNX UNILAT W/EMG",
        "ORDER_MNEMONIC": "CHEMODENERVATION MUSCLE LARYNX UNILAT W/EMG"
      },
      {
        "INDEX": 683291,
        "PAT_ID": 12061313,
        "VISIT_NO": 0,
        "ORDER_DTM": "2/25/2014",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "CHEMODERVATE FACIAL/TRIGEM/CERV MUSC MIGRAINE",
        "ORDER_MNEMONIC": "CHEMODERVATE FACIAL/TRIGEM/CERV MUSC MIGRAINE"
      },
      {
        "INDEX": 683292,
        "PAT_ID": 12061313,
        "VISIT_NO": 0,
        "ORDER_DTM": "2/25/2014",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "CHEMODENERVATION MUSCLE NECK UNILAT FOR DYSTONIA",
        "ORDER_MNEMONIC": "CHEMODENERVATION MUSCLE NECK UNILAT FOR DYSTONIA"
      },
      {
        "INDEX": 683293,
        "PAT_ID": 12061313,
        "VISIT_NO": 0,
        "ORDER_DTM": "9/20/2016",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "MANUAL THERAPY TQS 1/> REGIONS EACH 15 MINUTES",
        "ORDER_MNEMONIC": "MANUAL THER TECH,1+REGIONS,EA 15 MIN"
      },
      {
        "INDEX": 683294,
        "PAT_ID": 12061313,
        "VISIT_NO": 0,
        "ORDER_DTM": "9/20/2016",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THER PX 1/> AREAS EACH 15 MIN NEUROMUSC REEDUCA",
        "ORDER_MNEMONIC": "NEUROMUSC REEDUCAT,1+ AREAS, EA 15 MIN"
      },
      {
        "INDEX": 683295,
        "PAT_ID": 12061313,
        "VISIT_NO": 0,
        "ORDER_DTM": "9/20/2016",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 683296,
        "PAT_ID": 12061313,
        "VISIT_NO": 0,
        "ORDER_DTM": "9/20/2016",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THER PX 1/> AREAS EACH 15 MIN NEUROMUSC REEDUCA",
        "ORDER_MNEMONIC": "NEUROMUSC REEDUCAT,1+ AREAS, EA 15 MIN"
      },
      {
        "INDEX": 683297,
        "PAT_ID": 12061313,
        "VISIT_NO": 0,
        "ORDER_DTM": "9/20/2016",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 683298,
        "PAT_ID": 12061313,
        "VISIT_NO": 0,
        "ORDER_DTM": "9/20/2016",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "MANUAL THERAPY TQS 1/> REGIONS EACH 15 MINUTES",
        "ORDER_MNEMONIC": "MANUAL THER TECH,1+REGIONS,EA 15 MIN"
      },
      {
        "INDEX": 683546,
        "PAT_ID": 12061313,
        "VISIT_NO": 195220501,
        "ORDER_DTM": "11/8/2013 5:33:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONABOTULINUMTOXINA",
        "ORDER_MNEMONIC": "BOTOX 100 UNITS IJ SOLR"
      },
      {
        "INDEX": 683547,
        "PAT_ID": 12061313,
        "VISIT_NO": 195263082,
        "ORDER_DTM": "10/8/2013 3:30:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "GUAIFENESIN-CODEINE",
        "ORDER_MNEMONIC": "GUAIFENESIN-CODEINE 100-10 MG/5ML PO SYRP"
      },
      {
        "INDEX": 683548,
        "PAT_ID": 12061313,
        "VISIT_NO": 195263082,
        "ORDER_DTM": "10/8/2013 3:16:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FLUTICASONE PROPIONATE",
        "ORDER_MNEMONIC": "FLUTICASONE PROPIONATE 50 MCG/ACT NA SUSP"
      },
      {
        "INDEX": 683549,
        "PAT_ID": 12061313,
        "VISIT_NO": 195416360,
        "ORDER_DTM": "10/18/2013 9:21:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "VERAPAMIL HCL",
        "ORDER_MNEMONIC": "VERAPAMIL HCL ER 360 MG PO CP24"
      },
      {
        "INDEX": 683550,
        "PAT_ID": 12061313,
        "VISIT_NO": 195416360,
        "ORDER_DTM": "10/18/2013 9:20:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "VERAPAMIL HCL",
        "ORDER_MNEMONIC": "VERAPAMIL HCL ER 360 MG PO CP24"
      },
      {
        "INDEX": 683551,
        "PAT_ID": 12061313,
        "VISIT_NO": 195992617,
        "ORDER_DTM": "11/27/2013 6:10:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CEFUROXIME AXETIL",
        "ORDER_MNEMONIC": "CEFUROXIME AXETIL 500 MG PO TABS"
      },
      {
        "INDEX": 683552,
        "PAT_ID": 12061313,
        "VISIT_NO": 196007730,
        "ORDER_DTM": "1/8/2014 2:01:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROXYZINE HCL",
        "ORDER_MNEMONIC": "HYDROXYZINE HCL 50 MG PO TABS"
      },
      {
        "INDEX": 683553,
        "PAT_ID": 12061313,
        "VISIT_NO": 196007730,
        "ORDER_DTM": "1/8/2014 2:01:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE-ACETAMINOPHEN",
        "ORDER_MNEMONIC": "OXYCODONE-ACETAMINOPHEN 10-650 MG PO TABS"
      },
      {
        "INDEX": 683554,
        "PAT_ID": 12061313,
        "VISIT_NO": 196444801,
        "ORDER_DTM": "1/6/2014 5:09:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 683555,
        "PAT_ID": 12061313,
        "VISIT_NO": 196949575,
        "ORDER_DTM": "2/14/2014 2:48:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "ECHO TTHRC R-T 2D W/WO M-MODE COMPLETE REST&ST",
        "ORDER_MNEMONIC": "STRESS ECHO DOBUTAMINE"
      },
      {
        "INDEX": 683556,
        "PAT_ID": 12061313,
        "VISIT_NO": 197142875,
        "ORDER_DTM": "2/28/2014 3:02:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONABOTULINUMTOXINA",
        "ORDER_MNEMONIC": "BOTOX 100 UNITS IJ SOLR"
      },
      {
        "INDEX": 683557,
        "PAT_ID": 12061313,
        "VISIT_NO": 197643057,
        "ORDER_DTM": "4/3/2014 3:45:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "XTRNL ECG & 48 HR RECORD SCAN STOR W/R&I",
        "ORDER_MNEMONIC": "ECG MONITOR/ 24 HRS, ORIG ECG, W VIS SUPERIMPOS SCAN, COMPLETE"
      },
      {
        "INDEX": 683558,
        "PAT_ID": 12061313,
        "VISIT_NO": 197792091,
        "ORDER_DTM": "4/3/2014 4:40:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "XTRNL ECG & 48 HR RECORD SCAN STOR W/R&I",
        "ORDER_MNEMONIC": "ECG MONITOR/ 24 HRS, ORIG ECG, W VIS SUPERIMPOS SCAN, COMPLETE"
      },
      {
        "INDEX": 683559,
        "PAT_ID": 12061313,
        "VISIT_NO": 197884670,
        "ORDER_DTM": "5/8/2014 3:54:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "NERVE CONDUCTION STUDIES 3-4 STUDIES",
        "ORDER_MNEMONIC": "NERVE CONDUCTION STUDIES 3-4 STUDIES"
      },
      {
        "INDEX": 683560,
        "PAT_ID": 12061313,
        "VISIT_NO": 197884670,
        "ORDER_DTM": "5/8/2014 3:54:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "NEEDLE EMG EA EXTREMITY W/PARASPINL AREA LIMITED",
        "ORDER_MNEMONIC": "NEEDLE EMG EA EXTREMITY W/PARASPINL AREA LIMITED"
      },
      {
        "INDEX": 683561,
        "PAT_ID": 12061313,
        "VISIT_NO": 197886670,
        "ORDER_DTM": "4/10/2014 11:19:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "ECG ROUTINE ECG W/LEAST 12 LDS W/I&R",
        "ORDER_MNEMONIC": "ELECTROCARDIOGRAM, COMPLETE"
      },
      {
        "INDEX": 683562,
        "PAT_ID": 12061313,
        "VISIT_NO": 197886670,
        "ORDER_DTM": "4/10/2014 3:01:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "ECG ROUTINE ECG W/LEAST 12 LDS W/I&R",
        "ORDER_MNEMONIC": "ELECTROCARDIOGRAM, COMPLETE"
      },
      {
        "INDEX": 683563,
        "PAT_ID": 12061313,
        "VISIT_NO": 198180261,
        "ORDER_DTM": "5/5/2014 11:26:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "VERAPAMIL HCL",
        "ORDER_MNEMONIC": "VERAPAMIL HCL ER 360 MG PO CP24"
      },
      {
        "INDEX": 683564,
        "PAT_ID": 12061313,
        "VISIT_NO": 198263708,
        "ORDER_DTM": "5/23/2014 2:54:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FROVATRIPTAN SUCCINATE",
        "ORDER_MNEMONIC": "FROVATRIPTAN SUCCINATE 2.5 MG PO TABS"
      },
      {
        "INDEX": 683565,
        "PAT_ID": 12061313,
        "VISIT_NO": 198263708,
        "ORDER_DTM": "5/23/2014 2:57:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "VERAPAMIL HCL",
        "ORDER_MNEMONIC": "VERAPAMIL HCL ER 360 MG PO CP24"
      },
      {
        "INDEX": 683566,
        "PAT_ID": 12061313,
        "VISIT_NO": 198275859,
        "ORDER_DTM": "5/5/2014 6:24:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYOSCYAMINE SULFATE",
        "ORDER_MNEMONIC": "HYOSCYAMINE SULFATE 0.125 MG PO TABS"
      },
      {
        "INDEX": 683567,
        "PAT_ID": 12061313,
        "VISIT_NO": 198282108,
        "ORDER_DTM": "5/8/2014 9:04:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DICYCLOMINE HCL",
        "ORDER_MNEMONIC": "DICYCLOMINE HCL 10 MG PO CAPS"
      },
      {
        "INDEX": 683568,
        "PAT_ID": 12061313,
        "VISIT_NO": 198332200,
        "ORDER_DTM": "5/8/2014 3:48:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "BX SKIN SUBCUTANEOUS&/MUCOUS MEMBRANE 1 LESION",
        "ORDER_MNEMONIC": "BIOPSY OF SKIN LESION"
      },
      {
        "INDEX": 683569,
        "PAT_ID": 12061313,
        "VISIT_NO": 198401206,
        "ORDER_DTM": "5/29/2014 12:15:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BARIUM SULFATE",
        "ORDER_MNEMONIC": "BARIUM SULFATE 60 % PO SUSP"
      },
      {
        "INDEX": 683570,
        "PAT_ID": 12061313,
        "VISIT_NO": 198401206,
        "ORDER_DTM": "5/29/2014 12:15:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BARIUM SULFATE",
        "ORDER_MNEMONIC": "BARIUM SULFATE 98 % PO SUSR"
      },
      {
        "INDEX": 683571,
        "PAT_ID": 12061313,
        "VISIT_NO": 198679870,
        "ORDER_DTM": "5/29/2014 12:47:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FEXOFENADINE HCL",
        "ORDER_MNEMONIC": "FEXOFENADINE HCL 180 MG PO TABS"
      },
      {
        "INDEX": 683572,
        "PAT_ID": 12061313,
        "VISIT_NO": 198826649,
        "ORDER_DTM": "6/20/2014 4:05:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "CHEMODERVATE FACIAL/TRIGEM/CERV MUSC MIGRAINE",
        "ORDER_MNEMONIC": "CHEMODERVATE FACIAL/TRIGEM/CERV MUSC MIGRAINE"
      },
      {
        "INDEX": 683573,
        "PAT_ID": 12061313,
        "VISIT_NO": 199041133,
        "ORDER_DTM": "6/27/2014 2:58:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SERTRALINE HCL",
        "ORDER_MNEMONIC": "SERTRALINE HCL 25 MG PO TABS"
      },
      {
        "INDEX": 683574,
        "PAT_ID": 12061313,
        "VISIT_NO": 199379859,
        "ORDER_DTM": "7/10/2014 10:55:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PT MEDICARE PLAN OF CARE CERT/RE-CERT",
        "ORDER_MNEMONIC": "PT MEDICARE PLAN OF CARE CERT/RE-CERT"
      },
      {
        "INDEX": 683575,
        "PAT_ID": 12061313,
        "VISIT_NO": 199973616,
        "ORDER_DTM": "8/14/2014 6:48:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "SODIUM CHLORIDE 0.9 % IV BOLUS"
      },
      {
        "INDEX": 683576,
        "PAT_ID": 12061313,
        "VISIT_NO": 199973616,
        "ORDER_DTM": "8/14/2014 7:43:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PROMETHAZINE HCL",
        "ORDER_MNEMONIC": "PROMETHAZINE HCL 25 MG PO TABS"
      },
      {
        "INDEX": 683577,
        "PAT_ID": 12061313,
        "VISIT_NO": 200537347,
        "ORDER_DTM": "9/17/2014 10:15:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DIPHENHYDRAMINE HCL",
        "ORDER_MNEMONIC": "DIPHENHYDRAMINE HCL 50 MG/ML IJ SOLN"
      },
      {
        "INDEX": 683578,
        "PAT_ID": 12061313,
        "VISIT_NO": 200537347,
        "ORDER_DTM": "9/17/2014 11:17:00 AM",
        "ORDER_STATUS": "VERIFIED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LORAZEPAM",
        "ORDER_MNEMONIC": "LORAZEPAM 2 MG/ML IJ SOLN"
      },
      {
        "INDEX": 683579,
        "PAT_ID": 12061313,
        "VISIT_NO": 200537347,
        "ORDER_DTM": "9/17/2014 10:15:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 683580,
        "PAT_ID": 12061313,
        "VISIT_NO": 200537347,
        "ORDER_DTM": "10/13/2014 8:25:00 AM",
        "ORDER_STATUS": "VERIFIED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LACTATED RINGERS",
        "ORDER_MNEMONIC": "LACTATED RINGERS IV SOLN"
      },
      {
        "INDEX": 683581,
        "PAT_ID": 12061313,
        "VISIT_NO": 200931228,
        "ORDER_DTM": "10/8/2014 2:49:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DEXLANSOPRAZOLE",
        "ORDER_MNEMONIC": "DEXLANSOPRAZOLE 30 MG PO CPDR"
      },
      {
        "INDEX": 683582,
        "PAT_ID": 12061313,
        "VISIT_NO": 203345500,
        "ORDER_DTM": "2/11/2015 5:07:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DEXLANSOPRAZOLE",
        "ORDER_MNEMONIC": "DEXLANSOPRAZOLE 30 MG PO CPDR"
      },
      {
        "INDEX": 683583,
        "PAT_ID": 12061313,
        "VISIT_NO": 203707602,
        "ORDER_DTM": "3/3/2015 11:12:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "HYDROMORPHONE INJ DOSE RANGE RECORD"
      },
      {
        "INDEX": 683584,
        "PAT_ID": 12061313,
        "VISIT_NO": 203707602,
        "ORDER_DTM": "3/3/2015 11:11:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "12 LEAD ECG (EKG)",
        "ORDER_MNEMONIC": "12 LEAD ECG (EKG)"
      },
      {
        "INDEX": 683585,
        "PAT_ID": 12061313,
        "VISIT_NO": 203783702,
        "ORDER_DTM": "3/6/2015 4:14:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ALBUTEROL SULFATE",
        "ORDER_MNEMONIC": "ALBUTEROL SULFATE HFA 108 (90 BASE) MCG/ACT IN AERS"
      },
      {
        "INDEX": 683586,
        "PAT_ID": 12061313,
        "VISIT_NO": 203783702,
        "ORDER_DTM": "3/6/2015 4:14:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BECLOMETHASONE DIPROPIONATE",
        "ORDER_MNEMONIC": "BECLOMETHASONE DIPROPIONATE 80 MCG/ACT IN AERS"
      },
      {
        "INDEX": 683587,
        "PAT_ID": 12061313,
        "VISIT_NO": 203783702,
        "ORDER_DTM": "3/6/2015 4:14:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MELOXICAM",
        "ORDER_MNEMONIC": "MELOXICAM 15 MG PO TABS"
      },
      {
        "INDEX": 683588,
        "PAT_ID": 12061313,
        "VISIT_NO": 203995524,
        "ORDER_DTM": "3/16/2015 2:53:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PROMETHAZINE HCL",
        "ORDER_MNEMONIC": "PROMETHAZINE HCL 25 MG PO TABS"
      },
      {
        "INDEX": 683589,
        "PAT_ID": 12061313,
        "VISIT_NO": 204010942,
        "ORDER_DTM": "3/17/2015 3:45:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PREDNISONE",
        "ORDER_MNEMONIC": "PREDNISONE 10 MG PO TABS"
      },
      {
        "INDEX": 683590,
        "PAT_ID": 12061313,
        "VISIT_NO": 204090548,
        "ORDER_DTM": "3/20/2015 1:08:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "12 LEAD ECG (EKG)",
        "ORDER_MNEMONIC": "12 LEAD ECG (EKG)"
      },
      {
        "INDEX": 683591,
        "PAT_ID": 12061313,
        "VISIT_NO": 204090548,
        "ORDER_DTM": "3/20/2015 1:45:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 683592,
        "PAT_ID": 12061313,
        "VISIT_NO": 204090548,
        "ORDER_DTM": "3/20/2015 9:54:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "OXYCODONE IR ORAL RANGE RECORD"
      },
      {
        "INDEX": 683593,
        "PAT_ID": 12061313,
        "VISIT_NO": 204576157,
        "ORDER_DTM": "5/5/2015 1:58:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "COMPLEX UROFLOMETRY",
        "ORDER_MNEMONIC": "COMPLEX UROFLOWMETRY"
      },
      {
        "INDEX": 683594,
        "PAT_ID": 12061313,
        "VISIT_NO": 204576157,
        "ORDER_DTM": "5/5/2015 1:58:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "MEAS POST-VOIDING RESIDUAL URINE&/BLADDER CAP",
        "ORDER_MNEMONIC": "MEAS,POST-VOID RES,US,NON-IMAGING"
      },
      {
        "INDEX": 683595,
        "PAT_ID": 12061313,
        "VISIT_NO": 205105544,
        "ORDER_DTM": "5/7/2015 9:55:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "COLONOSCOPY INTERNAL REFERRAL"
      },
      {
        "INDEX": 683596,
        "PAT_ID": 12061313,
        "VISIT_NO": 205114596,
        "ORDER_DTM": "6/19/2015 12:19:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PROPOFOL",
        "ORDER_MNEMONIC": "PROPOFOL 10 MG/ML IV EMUL"
      },
      {
        "INDEX": 683597,
        "PAT_ID": 12061313,
        "VISIT_NO": 205114596,
        "ORDER_DTM": "6/19/2015 10:46:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "SODIUM CHLORIDE",
        "ORDER_MNEMONIC": "SODIUM CHLORIDE 0.9 % IV SOLN"
      },
      {
        "INDEX": 683698,
        "PAT_ID": 12061313,
        "VISIT_NO": 197474195,
        "ORDER_DTM": "4/25/2014 1:32:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DEXLANSOPRAZOLE",
        "ORDER_MNEMONIC": "DEXLANSOPRAZOLE 30 MG PO CPDR"
      },
      {
        "INDEX": 683699,
        "PAT_ID": 12061313,
        "VISIT_NO": 197872863,
        "ORDER_DTM": "4/15/2014 2:10:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LEVONORGESTREL",
        "ORDER_MNEMONIC": "LEVONORGESTREL 20 MCG/24HR IU IUD"
      },
      {
        "INDEX": 683700,
        "PAT_ID": 12061313,
        "VISIT_NO": 197554888,
        "ORDER_DTM": "3/20/2014 3:54:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DEXLANSOPRAZOLE",
        "ORDER_MNEMONIC": "DEXLANSOPRAZOLE 30 MG PO CPDR"
      },
      {
        "INDEX": 683701,
        "PAT_ID": 12061313,
        "VISIT_NO": 197771803,
        "ORDER_DTM": "4/10/2014 9:53:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "GABAPENTIN",
        "ORDER_MNEMONIC": "GABAPENTIN 300 MG PO CAPS"
      },
      {
        "INDEX": 683702,
        "PAT_ID": 12061313,
        "VISIT_NO": 197884670,
        "ORDER_DTM": "5/8/2014 3:54:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "TESTING AUTONOMIC NERVOUS SYSTEM FUNCTION",
        "ORDER_MNEMONIC": "TEST AUTO NERV SYS,SUDOMOTOR"
      },
      {
        "INDEX": 683703,
        "PAT_ID": 12061313,
        "VISIT_NO": 198263708,
        "ORDER_DTM": "5/23/2014 2:54:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PROMETHAZINE HCL",
        "ORDER_MNEMONIC": "PROMETHAZINE HCL 25 MG PO TABS"
      },
      {
        "INDEX": 683704,
        "PAT_ID": 12061313,
        "VISIT_NO": 198410660,
        "ORDER_DTM": "6/2/2014 8:40:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "BX SKIN SUBCUTANEOUS&/MUCOUS MEMBRANE 1 LESION",
        "ORDER_MNEMONIC": "BIOPSY OF SKIN LESION"
      },
      {
        "INDEX": 683705,
        "PAT_ID": 12061313,
        "VISIT_NO": 198826649,
        "ORDER_DTM": "6/20/2014 4:05:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONABOTULINUMTOXINA",
        "ORDER_MNEMONIC": "ONABOTULINUMTOXINA 100 UNITS IJ SOLR"
      },
      {
        "INDEX": 683706,
        "PAT_ID": 12061313,
        "VISIT_NO": 198596988,
        "ORDER_DTM": "5/23/2014 11:14:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ERGOCALCIFEROL",
        "ORDER_MNEMONIC": "ERGOCALCIFEROL 50000 UNITS PO CAPS"
      },
      {
        "INDEX": 683707,
        "PAT_ID": 12061313,
        "VISIT_NO": 199973616,
        "ORDER_DTM": "8/14/2014 7:45:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PROMETHAZINE HCL",
        "ORDER_MNEMONIC": "PROMETHAZINE HCL 25 MG PO TABS"
      },
      {
        "INDEX": 683708,
        "PAT_ID": 12061313,
        "VISIT_NO": 199973616,
        "ORDER_DTM": "8/14/2014 7:56:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "HYDROMORPHONE INJ DOSE RANGE RECORD"
      },
      {
        "INDEX": 683709,
        "PAT_ID": 12061313,
        "VISIT_NO": 199973616,
        "ORDER_DTM": "8/14/2014 6:48:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "TH TAKE HOME PROMETHAZINE HCL 25 MG PO TABS"
      },
      {
        "INDEX": 683710,
        "PAT_ID": 12061313,
        "VISIT_NO": 199973616,
        "ORDER_DTM": "8/14/2014 9:38:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE-ACETAMINOPHEN",
        "ORDER_MNEMONIC": "OXYCODONE-ACETAMINOPHEN 5-325 MG PO TABS"
      },
      {
        "INDEX": 683711,
        "PAT_ID": 12061313,
        "VISIT_NO": 200383580,
        "ORDER_DTM": "9/10/2014 1:44:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHOCARBAMOL",
        "ORDER_MNEMONIC": "METHOCARBAMOL 750 MG PO TABS"
      },
      {
        "INDEX": 683712,
        "PAT_ID": 12061313,
        "VISIT_NO": 200383580,
        "ORDER_DTM": "9/10/2014 1:44:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "GUAIFENESIN",
        "ORDER_MNEMONIC": "GUAIFENESIN ER 600 MG PO TB12"
      },
      {
        "INDEX": 683713,
        "PAT_ID": 12061313,
        "VISIT_NO": 200383580,
        "ORDER_DTM": "9/10/2014 1:16:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ESCITALOPRAM OXALATE",
        "ORDER_MNEMONIC": "ESCITALOPRAM OXALATE 20 MG PO TABS"
      },
      {
        "INDEX": 683714,
        "PAT_ID": 12061313,
        "VISIT_NO": 203121675,
        "ORDER_DTM": "2/19/2015 2:15:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "BREATH HYDROGEN/METHANE TEST",
        "ORDER_MNEMONIC": "BREATH HYDROGEN TEST"
      },
      {
        "INDEX": 683715,
        "PAT_ID": 12061313,
        "VISIT_NO": 203679268,
        "ORDER_DTM": "3/2/2015 10:41:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROCORTISONE",
        "ORDER_MNEMONIC": "HYDROCORTISONE 2.5 % RE CREA"
      },
      {
        "INDEX": 683716,
        "PAT_ID": 12061313,
        "VISIT_NO": 203707602,
        "ORDER_DTM": "3/3/2015 11:11:00 AM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 683717,
        "PAT_ID": 12061313,
        "VISIT_NO": 203707602,
        "ORDER_DTM": "3/3/2015 1:33:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "HYDROMORPHONE INJ DOSE RANGE RECORD"
      },
      {
        "INDEX": 683718,
        "PAT_ID": 12061313,
        "VISIT_NO": 203707602,
        "ORDER_DTM": "3/3/2015 11:11:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "SODIUM CHLORIDE 0.9 % IV BOLUS"
      },
      {
        "INDEX": 683719,
        "PAT_ID": 12061313,
        "VISIT_NO": 205114596,
        "ORDER_DTM": "6/19/2015 12:18:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FENTANYL CITRATE",
        "ORDER_MNEMONIC": "FENTANYL CITRATE 0.05 MG/ML IJ SOLN"
      },
      {
        "INDEX": 683913,
        "PAT_ID": 12061313,
        "VISIT_NO": 205528061,
        "ORDER_DTM": "6/1/2015 2:06:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DEXLANSOPRAZOLE",
        "ORDER_MNEMONIC": "DEXLANSOPRAZOLE 30 MG PO CPDR"
      },
      {
        "INDEX": 683914,
        "PAT_ID": 12061313,
        "VISIT_NO": 205572972,
        "ORDER_DTM": "6/2/2015 1:23:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "VERAPAMIL HCL",
        "ORDER_MNEMONIC": "VERAPAMIL HCL ER 360 MG PO CP24"
      },
      {
        "INDEX": 683915,
        "PAT_ID": 12061313,
        "VISIT_NO": 205592231,
        "ORDER_DTM": "6/3/2015 10:44:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "VERAPAMIL HCL",
        "ORDER_MNEMONIC": "VERAPAMIL HCL ER 360 MG PO CP24"
      },
      {
        "INDEX": 683916,
        "PAT_ID": 12061313,
        "VISIT_NO": 205767623,
        "ORDER_DTM": "6/12/2015 4:35:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRIAMCINOLONE ACETONIDE",
        "ORDER_MNEMONIC": "TRIAMCINOLONE ACETONIDE 40 MG/ML IJ SUSP"
      },
      {
        "INDEX": 683917,
        "PAT_ID": 12061313,
        "VISIT_NO": 205767623,
        "ORDER_DTM": "6/12/2015 3:07:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CLOTRIMAZOLE",
        "ORDER_MNEMONIC": "CLOTRIMAZOLE 1 % EX CREA"
      },
      {
        "INDEX": 683918,
        "PAT_ID": 12061313,
        "VISIT_NO": 205767623,
        "ORDER_DTM": "6/12/2015 4:35:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BUPIVACAINE HCL",
        "ORDER_MNEMONIC": "BUPIVACAINE HCL (PF) 0.25 % IJ SOLN"
      },
      {
        "INDEX": 683919,
        "PAT_ID": 12061313,
        "VISIT_NO": 205767623,
        "ORDER_DTM": "6/12/2015 3:29:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MELOXICAM",
        "ORDER_MNEMONIC": "MELOXICAM 15 MG PO TABS"
      },
      {
        "INDEX": 683920,
        "PAT_ID": 12061313,
        "VISIT_NO": 205767623,
        "ORDER_DTM": "6/12/2015 4:35:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "ARTHROCENTESIS ASPIR&/INJECTION MAJOR JT/BURSA",
        "ORDER_MNEMONIC": "DRAIN/INJECT LARGE JOINT/BURSA"
      },
      {
        "INDEX": 683921,
        "PAT_ID": 12061313,
        "VISIT_NO": 206321337,
        "ORDER_DTM": "7/13/2015 11:12:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "METHYLPREDNISOLONE",
        "ORDER_MNEMONIC": "METHYLPREDNISOLONE 4 MG PO KIT"
      },
      {
        "INDEX": 683922,
        "PAT_ID": 12061313,
        "VISIT_NO": 206577172,
        "ORDER_DTM": "7/25/2015 9:57:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DIVALPROEX SODIUM",
        "ORDER_MNEMONIC": "DIVALPROEX SODIUM 500 MG PO TBEC"
      },
      {
        "INDEX": 683923,
        "PAT_ID": 12061313,
        "VISIT_NO": 206577172,
        "ORDER_DTM": "7/26/2015",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "12 LEAD ECG (EKG)",
        "ORDER_MNEMONIC": "12 LEAD ECG (EKG)"
      },
      {
        "INDEX": 683924,
        "PAT_ID": 12061313,
        "VISIT_NO": 206577172,
        "ORDER_DTM": "7/25/2015 9:57:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ARIPIPRAZOLE",
        "ORDER_MNEMONIC": "ARIPIPRAZOLE 10 MG PO TABS"
      },
      {
        "INDEX": 683925,
        "PAT_ID": 12061313,
        "VISIT_NO": 206577172,
        "ORDER_DTM": "7/25/2015 9:57:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LISINOPRIL",
        "ORDER_MNEMONIC": "LISINOPRIL 10 MG PO TABS"
      },
      {
        "INDEX": 683926,
        "PAT_ID": 12061313,
        "VISIT_NO": 207450164,
        "ORDER_DTM": "9/9/2015 3:03:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PROMETHAZINE HCL",
        "ORDER_MNEMONIC": "PROMETHAZINE HCL 25 MG PO TABS"
      },
      {
        "INDEX": 683927,
        "PAT_ID": 12061313,
        "VISIT_NO": 207717783,
        "ORDER_DTM": "9/23/2015 6:58:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "VERAPAMIL HCL",
        "ORDER_MNEMONIC": "VERAPAMIL HCL ER 360 MG PO CP24"
      },
      {
        "INDEX": 683928,
        "PAT_ID": 12061313,
        "VISIT_NO": 207961955,
        "ORDER_DTM": "9/30/2015 4:06:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PROCHLORPERAZINE MALEATE",
        "ORDER_MNEMONIC": "PROCHLORPERAZINE MALEATE 10 MG PO TABS"
      },
      {
        "INDEX": 683929,
        "PAT_ID": 12061313,
        "VISIT_NO": 208331546,
        "ORDER_DTM": "10/19/2015 3:41:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ARIPIPRAZOLE",
        "ORDER_MNEMONIC": "ARIPIPRAZOLE 10 MG PO TABS"
      },
      {
        "INDEX": 683930,
        "PAT_ID": 12061313,
        "VISIT_NO": 208331546,
        "ORDER_DTM": "10/19/2015 3:42:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BACLOFEN",
        "ORDER_MNEMONIC": "BACLOFEN 10 MG PO TABS"
      },
      {
        "INDEX": 683931,
        "PAT_ID": 12061313,
        "VISIT_NO": 208352669,
        "ORDER_DTM": "10/19/2015 3:30:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "12 LEAD ECG (EKG)",
        "ORDER_MNEMONIC": "12 LEAD ECG (EKG)"
      },
      {
        "INDEX": 683932,
        "PAT_ID": 12061313,
        "VISIT_NO": 208368735,
        "ORDER_DTM": "12/4/2015 12:16:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BUTALBITAL-APAP-CAFFEINE",
        "ORDER_MNEMONIC": "BUTALBITAL-APAP-CAFFEINE 50-325-40 MG PO TABS"
      },
      {
        "INDEX": 683933,
        "PAT_ID": 12061313,
        "VISIT_NO": 208621052,
        "ORDER_DTM": "11/4/2015 2:08:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LORazepam",
        "ORDER_MNEMONIC": "LORAZEPAM 1 MG PO TABS"
      },
      {
        "INDEX": 683934,
        "PAT_ID": 12061313,
        "VISIT_NO": 208621052,
        "ORDER_DTM": "11/4/2015 2:51:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "COLLECTION VENOUS BLOOD VENIPUNCTURE",
        "ORDER_MNEMONIC": "COLLECTION VENOUS BLOOD,VENIPUNCTURE"
      },
      {
        "INDEX": 683935,
        "PAT_ID": 12061313,
        "VISIT_NO": 209267170,
        "ORDER_DTM": "12/16/2015 2:16:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BUTALBITAL-ACETAMINOPHEN",
        "ORDER_MNEMONIC": "BUTALBITAL-ACETAMINOPHEN 50-300 MG PO TABS"
      },
      {
        "INDEX": 683936,
        "PAT_ID": 12061313,
        "VISIT_NO": 209267170,
        "ORDER_DTM": "12/16/2015 2:16:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TIZANIDINE HCL",
        "ORDER_MNEMONIC": "TIZANIDINE HCL 2 MG PO TABS"
      },
      {
        "INDEX": 683937,
        "PAT_ID": 12061313,
        "VISIT_NO": 210786096,
        "ORDER_DTM": "3/11/2016 1:55:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BACLOFEN",
        "ORDER_MNEMONIC": "BACLOFEN 10 MG PO TABS"
      },
      {
        "INDEX": 683938,
        "PAT_ID": 12061313,
        "VISIT_NO": 210786180,
        "ORDER_DTM": "3/11/2016 2:56:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PHYSICAL THERAPY EVALUATION",
        "ORDER_MNEMONIC": "PHYS THERAPY EVALUATION"
      },
      {
        "INDEX": 683939,
        "PAT_ID": 12061313,
        "VISIT_NO": 210786256,
        "ORDER_DTM": "3/11/2016 3:50:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "HLTH&BEHAVIOR ASSMT EA 15 MIN W/PT RE-ASSMT",
        "ORDER_MNEMONIC": "HEAL & BEHAV ASSESS,EA 15 MIN,RE-ASSESS"
      },
      {
        "INDEX": 683940,
        "PAT_ID": 12061313,
        "VISIT_NO": 210787384,
        "ORDER_DTM": "3/29/2016 12:34:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DIPHENHYDRAMINE HCL",
        "ORDER_MNEMONIC": "DIPHENHYDRAMINE HCL 50 MG/ML IJ SOLN"
      },
      {
        "INDEX": 683941,
        "PAT_ID": 12061313,
        "VISIT_NO": 211576609,
        "ORDER_DTM": "3/24/2016 8:04:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "VERAPAMIL HCL",
        "ORDER_MNEMONIC": "VERAPAMIL HCL ER 360 MG PO CP24"
      },
      {
        "INDEX": 683942,
        "PAT_ID": 12061313,
        "VISIT_NO": 213007954,
        "ORDER_DTM": "6/3/2016 3:22:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DULoxetine HCl",
        "ORDER_MNEMONIC": "DULOXETINE HCL 30 MG PO CPEP"
      },
      {
        "INDEX": 683943,
        "PAT_ID": 12061313,
        "VISIT_NO": 213689079,
        "ORDER_DTM": "7/22/2016 11:43:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PHYSICAL THERAPY EVALUATION",
        "ORDER_MNEMONIC": "PHYS THERAPY EVALUATION"
      },
      {
        "INDEX": 683944,
        "PAT_ID": 12061313,
        "VISIT_NO": 213689079,
        "ORDER_DTM": "7/22/2016 11:43:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "THERAPEUTIC PX 1/> AREAS EACH 15 MIN EXERCISES",
        "ORDER_MNEMONIC": "THERAPEUTIC EXERCISES"
      },
      {
        "INDEX": 683945,
        "PAT_ID": 12061313,
        "VISIT_NO": 213689079,
        "ORDER_DTM": "8/15/2016 10:28:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PT MEDICARE PLAN OF CARE CERT/RE-CERT",
        "ORDER_MNEMONIC": "PT MEDICARE PLAN OF CARE CERT/RE-CERT"
      },
      {
        "INDEX": 683946,
        "PAT_ID": 12061313,
        "VISIT_NO": 213959428,
        "ORDER_DTM": "7/8/2016 1:45:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "OXYCODONE HCL",
        "ORDER_MNEMONIC": "OXYCODONE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 683947,
        "PAT_ID": 12061313,
        "VISIT_NO": 213959428,
        "ORDER_DTM": "7/8/2016 1:45:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DIVALPROEX SODIUM",
        "ORDER_MNEMONIC": "DIVALPROEX SODIUM 125 MG PO TBEC"
      },
      {
        "INDEX": 683948,
        "PAT_ID": 12061313,
        "VISIT_NO": 213959428,
        "ORDER_DTM": "7/8/2016 2:13:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Albuterol Sulfate",
        "ORDER_MNEMONIC": "ALBUTEROL SULFATE HFA 108 (90 BASE) MCG/ACT IN AERS"
      },
      {
        "INDEX": 683949,
        "PAT_ID": 12061313,
        "VISIT_NO": 213959428,
        "ORDER_DTM": "7/8/2016 2:13:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "GUAIFENESIN",
        "ORDER_MNEMONIC": "GUAIFENESIN 200 MG PO TABS"
      },
      {
        "INDEX": 683950,
        "PAT_ID": 12061313,
        "VISIT_NO": 214186975,
        "ORDER_DTM": "7/19/2016 4:31:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Divalproex Sodium",
        "ORDER_MNEMONIC": "DIVALPROEX SODIUM 500 MG PO TBEC"
      },
      {
        "INDEX": 683994,
        "PAT_ID": 12061313,
        "VISIT_NO": 205767623,
        "ORDER_DTM": "6/12/2015 2:10:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "GABAPENTIN",
        "ORDER_MNEMONIC": "GABAPENTIN 300 MG PO CAPS"
      },
      {
        "INDEX": 683995,
        "PAT_ID": 12061313,
        "VISIT_NO": 205767623,
        "ORDER_DTM": "6/12/2015 4:35:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LIDOCAINE HCL",
        "ORDER_MNEMONIC": "LIDOCAINE HCL 1 % IJ SOLN"
      },
      {
        "INDEX": 683996,
        "PAT_ID": 12061313,
        "VISIT_NO": 206110233,
        "ORDER_DTM": "7/2/2015 6:03:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "IOPAMIDOL",
        "ORDER_MNEMONIC": "IOPAMIDOL 76 % IV SOLN"
      },
      {
        "INDEX": 683997,
        "PAT_ID": 12061313,
        "VISIT_NO": 206357096,
        "ORDER_DTM": "7/14/2015 11:43:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "NARATRIPTAN HCL",
        "ORDER_MNEMONIC": "NARATRIPTAN HCL 2.5 MG PO TABS"
      },
      {
        "INDEX": 683998,
        "PAT_ID": 12061313,
        "VISIT_NO": 206577172,
        "ORDER_DTM": "7/25/2015 11:49:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "",
        "ORDER_MNEMONIC": "HYDROMORPHONE INJ DOSE RANGE RECORD"
      },
      {
        "INDEX": 683999,
        "PAT_ID": 12061313,
        "VISIT_NO": 207484156,
        "ORDER_DTM": "9/10/2015 12:14:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DEXLANSOPRAZOLE",
        "ORDER_MNEMONIC": "DEXLANSOPRAZOLE 30 MG PO CPDR"
      },
      {
        "INDEX": 684000,
        "PAT_ID": 12061313,
        "VISIT_NO": 208368735,
        "ORDER_DTM": "12/4/2015 12:16:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PROMETHAZINE HCL",
        "ORDER_MNEMONIC": "PROMETHAZINE HCL 25 MG PO TABS"
      },
      {
        "INDEX": 684001,
        "PAT_ID": 12061313,
        "VISIT_NO": 208368735,
        "ORDER_DTM": "12/4/2015 12:16:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TiZANidine HCl",
        "ORDER_MNEMONIC": "TIZANIDINE HCL 2 MG PO TABLET"
      },
      {
        "INDEX": 684002,
        "PAT_ID": 12061313,
        "VISIT_NO": 209267170,
        "ORDER_DTM": "12/16/2015 2:16:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PROMETHAZINE HCL",
        "ORDER_MNEMONIC": "PROMETHAZINE HCL 25 MG PO TABS"
      },
      {
        "INDEX": 684003,
        "PAT_ID": 12061313,
        "VISIT_NO": 210786180,
        "ORDER_DTM": "3/11/2016 2:56:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PT MEDICARE PLAN OF CARE CERT/RE-CERT",
        "ORDER_MNEMONIC": "PT MEDICARE PLAN OF CARE CERT/RE-CERT"
      },
      {
        "INDEX": 684004,
        "PAT_ID": 12061313,
        "VISIT_NO": 210787384,
        "ORDER_DTM": "3/29/2016 12:17:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ARIPIPRAZOLE",
        "ORDER_MNEMONIC": "ARIPIPRAZOLE 15 MG PO TABS"
      },
      {
        "INDEX": 684005,
        "PAT_ID": 12061313,
        "VISIT_NO": 210787384,
        "ORDER_DTM": "3/29/2016 1:09:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ONDANSETRON HCL",
        "ORDER_MNEMONIC": "ONDANSETRON HCL 4 MG/2ML IJ SOLN"
      },
      {
        "INDEX": 684006,
        "PAT_ID": 12061313,
        "VISIT_NO": 210787384,
        "ORDER_DTM": "3/29/2016 12:17:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Dexlansoprazole",
        "ORDER_MNEMONIC": "DEXILANT 30 MG PO CPDR"
      },
      {
        "INDEX": 684007,
        "PAT_ID": 12061313,
        "VISIT_NO": 210787384,
        "ORDER_DTM": "3/29/2016 12:34:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DEXAMETHASONE SODIUM PHOSPHATE",
        "ORDER_MNEMONIC": "DEXAMETHASONE SODIUM PHOSPHATE 4 MG/ML IJ SOLN"
      },
      {
        "INDEX": 684008,
        "PAT_ID": 12061313,
        "VISIT_NO": 211576609,
        "ORDER_DTM": "3/24/2016 8:04:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "VERAPAMIL HCL",
        "ORDER_MNEMONIC": "VERAPAMIL HCL ER 360 MG PO CP24"
      },
      {
        "INDEX": 684009,
        "PAT_ID": 12061313,
        "VISIT_NO": 213959428,
        "ORDER_DTM": "7/8/2016 2:13:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "FEXOFENADINE HCL",
        "ORDER_MNEMONIC": "FEXOFENADINE HCL 60 MG PO TABS"
      },
      {
        "INDEX": 684010,
        "PAT_ID": 12061313,
        "VISIT_NO": 214186975,
        "ORDER_DTM": "7/19/2016 4:31:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ARIPIPRAZOLE",
        "ORDER_MNEMONIC": "ARIPIPRAZOLE 15 MG PO TABS"
      },
      {
        "INDEX": 684011,
        "PAT_ID": 12061313,
        "VISIT_NO": 214186975,
        "ORDER_DTM": "7/19/2016 4:31:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRAZODONE HCL",
        "ORDER_MNEMONIC": "TRAZODONE HCL 100 MG PO TABS"
      },
      {
        "INDEX": 684012,
        "PAT_ID": 12061313,
        "VISIT_NO": 214431958,
        "ORDER_DTM": "8/1/2016 11:24:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Promethazine HCl",
        "ORDER_MNEMONIC": "PROMETHAZINE HCL 25 MG PO TABLET"
      },
      {
        "INDEX": 684013,
        "PAT_ID": 12061313,
        "VISIT_NO": 214498545,
        "ORDER_DTM": "8/3/2016 4:36:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DICYCLOMINE HCL",
        "ORDER_MNEMONIC": "DICYCLOMINE HCL 10 MG PO CAPS"
      },
      {
        "INDEX": 684014,
        "PAT_ID": 12061313,
        "VISIT_NO": 214884509,
        "ORDER_DTM": "8/22/2016 12:04:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HydrOXYzine Pamoate",
        "ORDER_MNEMONIC": "HYDROXYZINE PAMOATE 25 MG PO CAPS"
      },
      {
        "INDEX": 684015,
        "PAT_ID": 12061313,
        "VISIT_NO": 214889273,
        "ORDER_DTM": "8/22/2016 10:14:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TraZODone HCl",
        "ORDER_MNEMONIC": "TRAZODONE HCL 100 MG PO TABS"
      },
      {
        "INDEX": 684016,
        "PAT_ID": 12061313,
        "VISIT_NO": 215140269,
        "ORDER_DTM": "9/6/2016 9:24:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Verapamil HCl",
        "ORDER_MNEMONIC": "VERAPAMIL HCL ER 360 MG PO CP24"
      },
      {
        "INDEX": 684017,
        "PAT_ID": 12061313,
        "VISIT_NO": 215140269,
        "ORDER_DTM": "9/6/2016 9:29:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LORAZEPAM",
        "ORDER_MNEMONIC": "LORAZEPAM 2 MG/ML IJ SOLN"
      },
      {
        "INDEX": 684018,
        "PAT_ID": 12061313,
        "VISIT_NO": 215140600,
        "ORDER_DTM": "9/20/2016 10:46:00 AM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PT MEDICARE PLAN OF CARE CERT/RE-CERT",
        "ORDER_MNEMONIC": "PT MEDICARE PLAN OF CARE CERT/RE-CERT"
      },
      {
        "INDEX": 684019,
        "PAT_ID": 12061313,
        "VISIT_NO": 215140600,
        "ORDER_DTM": "9/20/2016 9:04:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "PHYSICAL THERAPY EVALUATION",
        "ORDER_MNEMONIC": "PHYS THERAPY EVALUATION"
      },
      {
        "INDEX": 684020,
        "PAT_ID": 12061313,
        "VISIT_NO": 215154952,
        "ORDER_DTM": "9/19/2016 11:29:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Lithium Carbonate",
        "ORDER_MNEMONIC": "LITHIUM CARBONATE 300 MG PO TABS"
      },
      {
        "INDEX": 684021,
        "PAT_ID": 12061313,
        "VISIT_NO": 215154952,
        "ORDER_DTM": "9/19/2016 10:48:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HydrOXYzine HCl",
        "ORDER_MNEMONIC": "HYDROXYZINE HCL 50 MG PO TABS"
      },
      {
        "INDEX": 684022,
        "PAT_ID": 12061313,
        "VISIT_NO": 215154952,
        "ORDER_DTM": "9/19/2016 11:14:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HydrOXYzine Pamoate",
        "ORDER_MNEMONIC": "HYDROXYZINE PAMOATE 25 MG PO CAPS"
      },
      {
        "INDEX": 684023,
        "PAT_ID": 12061313,
        "VISIT_NO": 215557977,
        "ORDER_DTM": "9/19/2016 5:21:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HydrOXYzine HCl",
        "ORDER_MNEMONIC": "HYDROXYZINE HCL 50 MG PO TABS"
      },
      {
        "INDEX": 684024,
        "PAT_ID": 12061313,
        "VISIT_NO": 215557977,
        "ORDER_DTM": "9/19/2016 5:22:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HydrOXYzine HCl",
        "ORDER_MNEMONIC": "HYDROXYZINE HCL 50 MG PO TABLET"
      },
      {
        "INDEX": 684025,
        "PAT_ID": 12061313,
        "VISIT_NO": 215664510,
        "ORDER_DTM": "9/27/2016 9:47:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Dexlansoprazole",
        "ORDER_MNEMONIC": "DEXILANT 30 MG PO CPDR"
      },
      {
        "INDEX": 684026,
        "PAT_ID": 12061313,
        "VISIT_NO": 215952231,
        "ORDER_DTM": "10/10/2016 7:43:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Lithium Carbonate",
        "ORDER_MNEMONIC": "LITHIUM CARBONATE 300 MG PO TABS"
      },
      {
        "INDEX": 684027,
        "PAT_ID": 12061313,
        "VISIT_NO": 216038726,
        "ORDER_DTM": "10/10/2016 2:27:00 PM",
        "ORDER_STATUS": "COMPLETED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Butalbital-APAP-Caffeine",
        "ORDER_MNEMONIC": "BUTALBITAL-APAP-CAFFEINE 50-325-40 MG PO TABS"
      },
      {
        "INDEX": 684028,
        "PAT_ID": 12061313,
        "VISIT_NO": 216038726,
        "ORDER_DTM": "10/10/2016 2:27:00 PM",
        "ORDER_STATUS": "DISCONTINUED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Ondansetron",
        "ORDER_MNEMONIC": "ONDANSETRON 4 MG PO TBDP"
      },
      {
        "INDEX": 684029,
        "PAT_ID": 12061313,
        "VISIT_NO": 216362591,
        "ORDER_DTM": "10/27/2016 2:16:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PredniSONE",
        "ORDER_MNEMONIC": "PREDNISONE 20 MG PO TABLET"
      },
      {
        "INDEX": 684030,
        "PAT_ID": 12061313,
        "VISIT_NO": 216507794,
        "ORDER_DTM": "11/10/2016 10:08:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Lithium Carbonate",
        "ORDER_MNEMONIC": "LITHIUM CARBONATE 300 MG PO CAPS"
      },
      {
        "INDEX": 684031,
        "PAT_ID": 12061313,
        "VISIT_NO": 216507794,
        "ORDER_DTM": "11/10/2016 10:43:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Dexlansoprazole",
        "ORDER_MNEMONIC": "DEXILANT 30 MG PO CPDR"
      },
      {
        "INDEX": 684032,
        "PAT_ID": 12061313,
        "VISIT_NO": 216507794,
        "ORDER_DTM": "11/10/2016 10:08:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ARIPiprazole",
        "ORDER_MNEMONIC": "ARIPIPRAZOLE 10 MG PO TABLET"
      },
      {
        "INDEX": 684033,
        "PAT_ID": 12061313,
        "VISIT_NO": 218498881,
        "ORDER_DTM": "1/30/2017 2:47:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Citalopram Hydrobromide",
        "ORDER_MNEMONIC": "CITALOPRAM HYDROBROMIDE 40 MG PO TABLET"
      },
      {
        "INDEX": 684034,
        "PAT_ID": 12061313,
        "VISIT_NO": 218498881,
        "ORDER_DTM": "1/30/2017 2:47:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HydrOXYzine Pamoate",
        "ORDER_MNEMONIC": "HYDROXYZINE PAMOATE 25 MG PO CAPS"
      },
      {
        "INDEX": 684134,
        "PAT_ID": 12061313,
        "VISIT_NO": 215154952,
        "ORDER_DTM": "9/19/2016 11:20:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "BusPIRone HCl",
        "ORDER_MNEMONIC": "BUSPIRONE HCL 15 MG PO TABS"
      },
      {
        "INDEX": 684135,
        "PAT_ID": 12061313,
        "VISIT_NO": 215154952,
        "ORDER_DTM": "9/19/2016 11:14:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TraZODone HCl",
        "ORDER_MNEMONIC": "TRAZODONE HCL 100 MG PO TABLET"
      },
      {
        "INDEX": 684136,
        "PAT_ID": 12061313,
        "VISIT_NO": 215154952,
        "ORDER_DTM": "9/19/2016 11:33:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Clotrimazole",
        "ORDER_MNEMONIC": "CLOTRIMAZOLE 1 % EX CREA"
      },
      {
        "INDEX": 684137,
        "PAT_ID": 12061313,
        "VISIT_NO": 216507794,
        "ORDER_DTM": "11/10/2016 10:08:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CloNIDine HCl",
        "ORDER_MNEMONIC": "CLONIDINE HCL 0.1 MG PO TABLET"
      },
      {
        "INDEX": 684138,
        "PAT_ID": 12061313,
        "VISIT_NO": 218498881,
        "ORDER_DTM": "1/30/2017 2:47:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "B Complex Vitamins",
        "ORDER_MNEMONIC": "B COMPLEX-B12 PO TABLET"
      },
      {
        "INDEX": 684139,
        "PAT_ID": 12061313,
        "VISIT_NO": 218498881,
        "ORDER_DTM": "1/30/2017 2:47:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Levonorgestrel",
        "ORDER_MNEMONIC": "LEVONORGESTREL 20 MCG/24HR IU IUD"
      }
    ],
    9096868: [
      {
        "INDEX": 14415,
        "PAT_ID": 9096868,
        "VISIT_NO": 0,
        "ORDER_DTM": "11/14/2014",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "NJX ANES&/STRD W/IMG TFRML EDRL LMBR/SAC 1 LVL",
        "ORDER_MNEMONIC": "INJ,FORAMEN,L/S,1 LEVEL"
      },
      {
        "INDEX": 14416,
        "PAT_ID": 9096868,
        "VISIT_NO": 0,
        "ORDER_DTM": "11/14/2014",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "NJX ANES&/STRD W/IMG TFRML EDRL LMBR/SAC EA LV",
        "ORDER_MNEMONIC": "INJ,FORAMEN,L/S,ADDL LEVELS"
      },
      {
        "INDEX": 14417,
        "PAT_ID": 9096868,
        "VISIT_NO": 0,
        "ORDER_DTM": "9/3/2015",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "NJX ANES&/STRD W/IMG TFRML EDRL LMBR/SAC 1 LVL",
        "ORDER_MNEMONIC": "INJ,FORAMEN,L/S,1 LEVEL"
      },
      {
        "INDEX": 14418,
        "PAT_ID": 9096868,
        "VISIT_NO": 0,
        "ORDER_DTM": "2/10/2016",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "PROCEDURE",
        "PRIMARY_MNEMONIC": "NJX ANES&/STRD W/IMG TFRML EDRL LMBR/SAC 1 LVL",
        "ORDER_MNEMONIC": "INJ,FORAMEN,L/S,1 LEVEL"
      },
      {
        "INDEX": 14419,
        "PAT_ID": 9096868,
        "VISIT_NO": 195187622,
        "ORDER_DTM": "10/2/2013 5:16:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Losartan Potassium",
        "ORDER_MNEMONIC": "LOSARTAN POTASSIUM 50 MG PO TABLET"
      },
      {
        "INDEX": 14420,
        "PAT_ID": 9096868,
        "VISIT_NO": 195187622,
        "ORDER_DTM": "10/2/2013 5:16:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Potassium Chloride",
        "ORDER_MNEMONIC": "POTASSIUM CHLORIDE 20 MEQ PO PACK"
      },
      {
        "INDEX": 14421,
        "PAT_ID": 9096868,
        "VISIT_NO": 195187622,
        "ORDER_DTM": "10/2/2013 5:16:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DILTIAZEM HCL",
        "ORDER_MNEMONIC": "DILTIAZEM HCL 120 MG PO TABS"
      },
      {
        "INDEX": 14422,
        "PAT_ID": 9096868,
        "VISIT_NO": 195305802,
        "ORDER_DTM": "10/16/2013 2:40:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MOXIFLOXACIN HCL",
        "ORDER_MNEMONIC": "MOXIFLOXACIN HCL 0.5 % OP SOLN"
      },
      {
        "INDEX": 14423,
        "PAT_ID": 9096868,
        "VISIT_NO": 195305802,
        "ORDER_DTM": "10/16/2013 2:40:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PREDNISOLONE ACETATE",
        "ORDER_MNEMONIC": "PREDNISOLONE ACETATE 0.12 % OP SUSP"
      },
      {
        "INDEX": 14424,
        "PAT_ID": 9096868,
        "VISIT_NO": 195305830,
        "ORDER_DTM": "10/30/2013 3:14:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "MOXIFLOXACIN HCL",
        "ORDER_MNEMONIC": "MOXIFLOXACIN HCL 0.5 % OP SOLN"
      },
      {
        "INDEX": 14425,
        "PAT_ID": 9096868,
        "VISIT_NO": 195305830,
        "ORDER_DTM": "10/30/2013 3:14:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PREDNISOLONE ACETATE",
        "ORDER_MNEMONIC": "PREDNISOLONE ACETATE 0.12 % OP SUSP"
      },
      {
        "INDEX": 14426,
        "PAT_ID": 9096868,
        "VISIT_NO": 195635951,
        "ORDER_DTM": "11/4/2013 12:45:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "GABAPENTIN",
        "ORDER_MNEMONIC": "GABAPENTIN 400 MG PO CAPS"
      },
      {
        "INDEX": 14427,
        "PAT_ID": 9096868,
        "VISIT_NO": 195635951,
        "ORDER_DTM": "11/4/2013 12:45:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "GABAPENTIN",
        "ORDER_MNEMONIC": "GABAPENTIN 100 MG PO CAPS"
      },
      {
        "INDEX": 14428,
        "PAT_ID": 9096868,
        "VISIT_NO": 195635951,
        "ORDER_DTM": "11/4/2013 12:45:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DiltiaZEM HCl",
        "ORDER_MNEMONIC": "DILTIAZEM HCL 120 MG PO TABLET"
      },
      {
        "INDEX": 14429,
        "PAT_ID": 9096868,
        "VISIT_NO": 195678632,
        "ORDER_DTM": "11/15/2013 4:41:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "GABAPENTIN",
        "ORDER_MNEMONIC": "GABAPENTIN 400 MG PO CAPS"
      },
      {
        "INDEX": 14430,
        "PAT_ID": 9096868,
        "VISIT_NO": 195753506,
        "ORDER_DTM": "11/12/2013 8:42:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Folic Acid",
        "ORDER_MNEMONIC": "FOLIC ACID 1 MG PO TABLET"
      },
      {
        "INDEX": 14431,
        "PAT_ID": 9096868,
        "VISIT_NO": 198379245,
        "ORDER_DTM": "5/12/2014 9:50:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Nitroglycerin",
        "ORDER_MNEMONIC": "NITROGLYCERIN 0.4 MG SL SUBL"
      },
      {
        "INDEX": 14432,
        "PAT_ID": 9096868,
        "VISIT_NO": 198546981,
        "ORDER_DTM": "5/23/2014 2:33:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LANSOPRAZOLE",
        "ORDER_MNEMONIC": "LANSOPRAZOLE 30 MG PO CPDR"
      },
      {
        "INDEX": 14433,
        "PAT_ID": 9096868,
        "VISIT_NO": 198734343,
        "ORDER_DTM": "6/2/2014 4:18:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "GABAPENTIN",
        "ORDER_MNEMONIC": "GABAPENTIN 400 MG PO CAPS"
      },
      {
        "INDEX": 14434,
        "PAT_ID": 9096868,
        "VISIT_NO": 200879359,
        "ORDER_DTM": "2/4/2015 2:26:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Celecoxib",
        "ORDER_MNEMONIC": "CELECOXIB 100 MG PO CAPS"
      },
      {
        "INDEX": 14435,
        "PAT_ID": 9096868,
        "VISIT_NO": 201295655,
        "ORDER_DTM": "11/4/2014 12:07:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TRAMADOL HCL",
        "ORDER_MNEMONIC": "TRAMADOL HCL 50 MG PO TABS"
      },
      {
        "INDEX": 14436,
        "PAT_ID": 9096868,
        "VISIT_NO": 201636013,
        "ORDER_DTM": "1/13/2015 2:16:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "GABAPENTIN",
        "ORDER_MNEMONIC": "GABAPENTIN 100 MG PO CAPS"
      },
      {
        "INDEX": 14437,
        "PAT_ID": 9096868,
        "VISIT_NO": 201636013,
        "ORDER_DTM": "1/13/2015 2:16:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "TraMADol HCl",
        "ORDER_MNEMONIC": "TRAMADOL HCL 50 MG PO TABLET"
      },
      {
        "INDEX": 14438,
        "PAT_ID": 9096868,
        "VISIT_NO": 201636013,
        "ORDER_DTM": "1/13/2015 2:13:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Lansoprazole",
        "ORDER_MNEMONIC": "LANSOPRAZOLE 30 MG PO CPDR"
      },
      {
        "INDEX": 14439,
        "PAT_ID": 9096868,
        "VISIT_NO": 201636013,
        "ORDER_DTM": "1/13/2015 2:16:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Cephalexin",
        "ORDER_MNEMONIC": "CEPHALEXIN 250 MG PO CAPS"
      },
      {
        "INDEX": 14440,
        "PAT_ID": 9096868,
        "VISIT_NO": 201636013,
        "ORDER_DTM": "1/13/2015 2:16:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "LOSARTAN POTASSIUM",
        "ORDER_MNEMONIC": "LOSARTAN POTASSIUM 25 MG PO TABS"
      },
      {
        "INDEX": 14441,
        "PAT_ID": 9096868,
        "VISIT_NO": 201636013,
        "ORDER_DTM": "1/13/2015 2:13:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DILTIAZEM HCL",
        "ORDER_MNEMONIC": "CARDIZEM 120 MG PO TABS"
      },
      {
        "INDEX": 14442,
        "PAT_ID": 9096868,
        "VISIT_NO": 201721907,
        "ORDER_DTM": "12/4/2014 11:53:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "GABAPENTIN",
        "ORDER_MNEMONIC": "GABAPENTIN 300 MG PO CAPS"
      },
      {
        "INDEX": 14443,
        "PAT_ID": 9096868,
        "VISIT_NO": 212156247,
        "ORDER_DTM": "4/28/2016 3:28:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Gabapentin",
        "ORDER_MNEMONIC": "GABAPENTIN 300 MG PO CAPS"
      },
      {
        "INDEX": 14444,
        "PAT_ID": 9096868,
        "VISIT_NO": 213907612,
        "ORDER_DTM": "8/29/2016 3:14:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Isosorbide Mononitrate",
        "ORDER_MNEMONIC": "ISOSORBIDE MONONITRATE ER 30 MG PO TB24"
      },
      {
        "INDEX": 14445,
        "PAT_ID": 9096868,
        "VISIT_NO": 213907612,
        "ORDER_DTM": "8/29/2016 3:14:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CloNIDine HCl",
        "ORDER_MNEMONIC": "CLONIDINE HCL 0.1 MG PO TABLET"
      },
      {
        "INDEX": 14446,
        "PAT_ID": 9096868,
        "VISIT_NO": 213907612,
        "ORDER_DTM": "8/29/2016 3:14:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Potassium Chloride",
        "ORDER_MNEMONIC": "POTASSIUM CHLORIDE ER 10 MEQ PO CPCR"
      },
      {
        "INDEX": 14447,
        "PAT_ID": 9096868,
        "VISIT_NO": 213907612,
        "ORDER_DTM": "8/29/2016 3:14:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Pantoprazole Sodium",
        "ORDER_MNEMONIC": "PANTOPRAZOLE SODIUM 40 MG PO TBEC"
      },
      {
        "INDEX": 14448,
        "PAT_ID": 9096868,
        "VISIT_NO": 213907612,
        "ORDER_DTM": "8/29/2016 3:14:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "AmLODIPine Besylate",
        "ORDER_MNEMONIC": "AMLODIPINE BESYLATE 5 MG PO TABLET"
      },
      {
        "INDEX": 14449,
        "PAT_ID": 9096868,
        "VISIT_NO": 213907612,
        "ORDER_DTM": "8/29/2016 3:14:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "Atorvastatin Calcium",
        "ORDER_MNEMONIC": "ATORVASTATIN CALCIUM 40 MG PO TABLET"
      },
      {
        "INDEX": 14450,
        "PAT_ID": 9096868,
        "VISIT_NO": 213907612,
        "ORDER_DTM": "8/29/2016 3:14:00 PM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DiltiaZEM HCl Coated Beads",
        "ORDER_MNEMONIC": "CARDIZEM LA 120 MG PO TB24"
      }
    ],
    7172620: [
      {
        "INDEX": 695135,
        "PAT_ID": 7172620,
        "VISIT_NO": 206529506,
        "ORDER_DTM": "9/18/2015 9:04:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "CYCLOBENZAPRINE HCL",
        "ORDER_MNEMONIC": "CYCLOBENZAPRINE HCL 5 MG PO TABS"
      },
      {
        "INDEX": 695136,
        "PAT_ID": 7172620,
        "VISIT_NO": 207970878,
        "ORDER_DTM": "11/13/2015 9:04:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "VALACYCLOVIR HCL",
        "ORDER_MNEMONIC": "VALACYCLOVIR HCL 1 G PO TABS"
      },
      {
        "INDEX": 695137,
        "PAT_ID": 7172620,
        "VISIT_NO": 208894114,
        "ORDER_DTM": "12/11/2015 9:20:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "ACETAMINOPHEN",
        "ORDER_MNEMONIC": "ACETAMINOPHEN 325 MG PO TABS"
      },
      {
        "INDEX": 695138,
        "PAT_ID": 7172620,
        "VISIT_NO": 209431149,
        "ORDER_DTM": "12/11/2015 10:02:00 AM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PHENTERMINE HCL",
        "ORDER_MNEMONIC": "PHENTERMINE HCL 30 MG PO CAPS"
      },
      {
        "INDEX": 695139,
        "PAT_ID": 7172620,
        "VISIT_NO": 209821266,
        "ORDER_DTM": "1/19/2016 4:31:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "DIAZEPAM",
        "ORDER_MNEMONIC": "DIAZEPAM 5 MG PO TABS"
      },
      {
        "INDEX": 695140,
        "PAT_ID": 7172620,
        "VISIT_NO": 209821266,
        "ORDER_DTM": "1/19/2016 4:31:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN",
        "ORDER_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN 7.5-325 MG PO TABS"
      },
      {
        "INDEX": 695141,
        "PAT_ID": 7172620,
        "VISIT_NO": 209821266,
        "ORDER_DTM": "1/19/2016 4:31:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "NAPROXEN",
        "ORDER_MNEMONIC": "NAPROXEN 500 MG PO TABS"
      },
      {
        "INDEX": 695260,
        "PAT_ID": 7172620,
        "VISIT_NO": 206529506,
        "ORDER_DTM": "9/18/2015 9:04:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN",
        "ORDER_MNEMONIC": "HYDROCODONE-ACETAMINOPHEN 7.5-325 MG PO TABS"
      },
      {
        "INDEX": 695261,
        "PAT_ID": 7172620,
        "VISIT_NO": 206529506,
        "ORDER_DTM": "9/18/2015 9:04:00 AM",
        "ORDER_STATUS": "ORDERED",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "IBUPROFEN-DIPHENHYDRAMINE CIT",
        "ORDER_MNEMONIC": "ADVIL PM PO"
      },
      {
        "INDEX": 695262,
        "PAT_ID": 7172620,
        "VISIT_NO": 209649357,
        "ORDER_DTM": "12/22/2015 4:21:00 PM",
        "ORDER_STATUS": "SENT",
        "ORDER_CATALOG_TYPE": "MEDICATION",
        "PRIMARY_MNEMONIC": "PHENTERMINE-TOPIRAMATE",
        "ORDER_MNEMONIC": "PHENTERMINE-TOPIRAMATE 3.75-23 MG PO CP24"
      }
    ]
  }

}
