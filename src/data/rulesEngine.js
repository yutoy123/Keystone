// Documentation Pathway Navigator — Rules Engine
// State-of-focus for this MVP: California, USA
// This structure is intentionally kept as plain data (not hardcoded logic)
// so it can be extended to new goals/states without rewriting components.

export const GOALS = [
  {
    id: "shelter",
    label: "Accessing a Shelter Bed",
    available: true,
  },
  {
    id: "bank",
    label: "Opening a Bank Account",
    available: true,
  },
  {
    id: "school",
    label: "Enrolling a Child in School",
    available: true,
  },
  {
    id: "housing",
    label: "Renting an Apartment",
    available: true,
  },
];

const ID_QUESTION = {
  id: "hasId",
  label: "Does the client have a valid, current government-issued ID?",
  options: [
    { value: "valid", label: "Yes, valid/current ID" },
    { value: "expired", label: "Only an expired ID" },
    { value: "none", label: "No ID at all" },
  ],
};

export const DOCUMENT_QUESTIONS = {
  shelter: [
    ID_QUESTION,
    {
      id: "hasBirthCert",
      label: "Does the client have their birth certificate?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No / lost / never issued" },
      ],
    },
    {
      id: "canProveHomelessness",
      label:
        "Can the client's homelessness/shelter status currently be verified by a caseworker?",
      options: [
        { value: "yes", label: "Yes, I can attest to this" },
        { value: "no", label: "No established relationship yet" },
      ],
    },
  ],
  bank: [
    ID_QUESTION,
    {
      id: "hasSecondaryId",
      label:
        "Does the client have two secondary forms of ID (e.g., Social Security card + utility bill or similar proof of address)?",
      options: [
        { value: "yes", label: "Yes — two secondary IDs available" },
        { value: "no", label: "No secondary IDs available" },
      ],
    },
    {
      id: "hasTaxId",
      label: "Does the client have a Taxpayer Identification Number (TIN)?",
      options: [
        { value: "ssn", label: "Yes — Social Security Number (SSN)" },
        { value: "itin", label: "ITIN only (no SSN)" },
        { value: "none", label: "Neither SSN nor ITIN" },
      ],
    },
  ],
  school: [
    {
      id: "hasBirthCert",
      label: "Does the client have the child's birth certificate?",
      options: [
        { value: "yes", label: "Yes — birth certificate available" },
        { value: "lost", label: "Lost or unavailable" },
        { value: "no", label: "No / never issued" },
      ],
    },
    {
      id: "hasProofOfResidency",
      label:
        "Does the client have proof of residency (utility bill, lease, or similar)?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No proof of residency available" },
      ],
    },
    {
      id: "canVerifyHomelessness",
      label:
        "Can the family's homelessness/housing instability currently be verified by a caseworker for McKinney-Vento purposes?",
      options: [
        { value: "yes", label: "Yes, I can attest to this" },
        { value: "no", label: "No established relationship yet" },
      ],
    },
  ],
  housing: [
    ID_QUESTION,
    {
      id: "hasIncomeProof",
      label:
        "Does the client have proof of income (pay stubs, offer letter, bank statements) or a housing subsidy/voucher?",
      options: [
        { value: "yes", label: "Yes — income documentation available" },
        {
          value: "voucher",
          label: "Has a Housing Choice Voucher (Section 8) or similar subsidy",
        },
        { value: "no", label: "No proof of income available" },
      ],
    },
    {
      id: "hasSsnOrItin",
      label: "Can the client provide an SSN or ITIN for a credit/background check?",
      options: [
        { value: "ssn", label: "Yes — Social Security Number (SSN)" },
        { value: "itin", label: "ITIN only (no SSN)" },
        { value: "none", label: "Cannot / prefers not to provide" },
      ],
    },
  ],
};

export function getDocumentQuestions(goalId) {
  return DOCUMENT_QUESTIONS[goalId] ?? [];
}

// Core decision tree for the "shelter" goal, California-specific.
// Returns a structured result: checklist steps + whether a deadlock
// (and therefore a generated letter) is triggered.
export function evaluateShelterPath(answers) {
  const { hasId, hasBirthCert, canProveHomelessness } = answers;

  // Case 1: Valid ID — lowest friction path
  if (hasId === "valid") {
    return {
      deadlock: false,
      needsLetter: false,
      summaryTitle: "Standard Intake Path",
      steps: [
        {
          title: "Bring current ID to intake",
          detail:
            "Most CoC-funded emergency shelters will process intake using a valid government ID. Be ready to answer standard HMIS (Homeless Management Information System) intake questions.",
        },
      ],
      citation: "HUD CoC / ESG Program intake guidelines",
    };
  }

  // Case 2: Expired ID only — HUD emergency shelter protection applies
  if (hasId === "expired") {
    return {
      deadlock: false,
      needsLetter: false,
      summaryTitle: "Expired ID — Still Eligible for Emergency Shelter",
      steps: [
        {
          title: "Bring expired ID to intake",
          detail:
            "HUD policy prohibits emergency shelters from denying shelter solely due to lack of current/valid ID. Bring what you have.",
        },
        {
          title: "Cite HUD ESG/CoC policy if challenged",
          detail:
            "If a shelter intake worker questions eligibility, reference HUD's Emergency Solutions Grant (ESG) and Continuum of Care (CoC) program rules, which require emergency shelter access regardless of documentation status.",
        },
      ],
      citation: "HUD Emergency Solutions Grant (ESG) Program regulations",
    };
  }

  // Case 3: No ID, but has birth certificate — DMV state ID path
  if (hasId === "none" && hasBirthCert === "yes") {
    return {
      deadlock: false,
      needsLetter: canProveHomelessness === "yes",
      summaryTitle: "No ID, Has Birth Certificate — DMV State ID Path",
      steps: [
        {
          title: "Apply for a California state ID (not driver's license)",
          detail:
            "Use the birth certificate as primary identity document at the DMV. A state ID card is cheaper and requires no driving test.",
        },
        {
          title: "Request the homelessness fee waiver",
          detail:
            canProveHomelessness === "yes"
              ? "Under CA Vehicle Code §14902, the ID fee (~$40) is waivable for individuals experiencing homelessness. A caseworker letter (generated below) satisfies this requirement."
              : "A fee waiver is available under CA VC §14902, but requires proof of homelessness — typically a caseworker or outreach worker letter. Establish this relationship before applying, or apply at full fee if urgent.",
        },
      ],
      citation: "California Vehicle Code §14902",
    };
  }

  // Case 4: No ID and no birth certificate — the core deadlock
  if (hasId === "none" && hasBirthCert === "no") {
    return {
      deadlock: true,
      needsLetter: true,
      summaryTitle: "Deadlock Detected — No ID and No Birth Certificate",
      steps: [
        {
          title: "Request birth certificate from Vital Records",
          detail:
            "Contact the CA Department of Public Health (or county Vital Records office where born). Standard requests require proof of identity — which the client does not have.",
        },
        {
          title: "Use the Certification of Identity workaround",
          detail:
            "Several CA county Vital Records offices accept a notarized 'Certification of Identity,' often combined with a caseworker letter confirming the person's identity and current shelter status, as a substitute for standard ID.",
        },
        {
          title: "Generate and sign the Caseworker Identity Verification Letter",
          detail:
            "This letter is the key document that unlocks this pathway. It should be brought to the Vital Records office alongside the Certification of Identity form.",
        },
      ],
      citation:
        "CA county Vital Records offices — Certification of Identity provisions (verify current requirements locally; policy varies by county)",
    };
  }

  return {
    deadlock: false,
    needsLetter: false,
    summaryTitle: "Unable to determine pathway",
    steps: [
      {
        title: "Insufficient information",
        detail: "Please answer all questions to generate a pathway.",
      },
    ],
    citation: "",
  };
}

// Core decision tree for the "bank" goal — CIP/BSA identity verification.
// Mirrors evaluateShelterPath branching: valid ID, expired ID,
// no-primary-but-secondary-available, and deadlock.
export function evaluateBankPath(answers) {
  const { hasId, hasSecondaryId, hasTaxId } = answers;

  // Case 1: Valid primary ID — standard CIP path
  if (hasId === "valid") {
    return {
      deadlock: false,
      needsLetter: false,
      summaryTitle: "Standard Bank Account Opening Path",
      steps: [
        {
          title: "Bring a valid primary ID to the bank",
          detail:
            "A current driver's license, state ID, or passport satisfies most banks' primary documentary verification under federal Customer Identification Program (CIP) rules.",
        },
        {
          title: "Provide your Taxpayer Identification Number (TIN)",
          detail:
            hasTaxId === "ssn"
              ? "Federal law requires banks to collect your full SSN before opening an account. Have your Social Security card or memorized number ready."
              : hasTaxId === "itin"
                ? "Your Individual Taxpayer Identification Number (ITIN) satisfies the federal TIN requirement for clients without an SSN. Bring your IRS ITIN assignment letter."
                : "Banks must collect a TIN (SSN or ITIN) before opening an account. Apply for an ITIN via IRS Form W-7, or seek a BankOn-certified or 'second chance' account program that assists clients without an SSN.",
        },
      ],
      citation:
        "31 CFR § 1020.220 — Bank Secrecy Act Customer Identification Program (CIP)",
    };
  }

  // Case 2: Expired primary ID — cannot satisfy documentary CIP as-is
  if (hasId === "expired") {
    return {
      deadlock: false,
      needsLetter: false,
      summaryTitle: "Expired ID — Renew or Use Secondary Documents",
      steps: [
        {
          title: "Renew ID at the DMV, or gather two secondary IDs",
          detail:
            "An expired driver's license or state ID generally does not satisfy bank CIP documentary verification. Renew at the DMV, or ask whether the bank will accept two secondary forms (e.g., Social Security card + current utility bill).",
        },
        {
          title: "Confirm TIN requirements before visiting",
          detail:
            hasTaxId === "none"
              ? "You will also need a TIN (SSN or ITIN) before the account can be opened. Apply for an ITIN via IRS Form W-7 if you do not have an SSN."
              : "Bring your SSN or ITIN — federal CIP rules require collection of a taxpayer identification number prior to account opening.",
        },
      ],
      citation:
        "31 CFR § 1020.220(a)(2)(ii)(A) — CIP documentary identity verification",
    };
  }

  // Case 3: No primary ID, but two secondary forms available
  if (hasId === "none" && hasSecondaryId === "yes") {
    return {
      deadlock: false,
      needsLetter: hasTaxId === "none",
      summaryTitle: "No Primary ID — Secondary Document Path",
      steps: [
        {
          title: "Bring both secondary IDs to the bank",
          detail:
            "Many banks accept two secondary forms of identification — such as a Social Security card plus a utility bill or lease — when a primary photo ID is unavailable, per their risk-based CIP procedures.",
        },
        {
          title: "Provide proof of address and TIN",
          detail:
            hasTaxId === "ssn"
              ? "CIP rules require name, date of birth, address, and a TIN. Your utility bill satisfies address verification; have your SSN ready."
              : hasTaxId === "itin"
                ? "Your ITIN satisfies the federal TIN requirement. Some banks also accept a caseworker letter confirming identity and current address when using secondary documents."
                : "Federal law requires a TIN before account opening. Without an SSN or ITIN, apply for an ITIN (Form W-7) or locate a BankOn-certified institution offering accounts for clients without standard documentation.",
        },
        {
          title: "Ask about non-documentary CIP verification",
          detail:
            hasTaxId === "none"
              ? "A caseworker identity/address verification letter (generated below) may support non-documentary verification at CIP-flexible institutions while the client obtains a TIN."
              : "If one secondary document is weak (e.g., no photo), ask whether the bank can verify identity through non-documentary methods such as credit bureau checks or caseworker attestation.",
        },
      ],
      citation:
        "31 CFR § 1020.220 — CIP documentary and non-documentary verification procedures",
    };
  }

  // Case 4: No primary ID and no secondary IDs — core deadlock
  if (hasId === "none" && hasSecondaryId === "no") {
    return {
      deadlock: true,
      needsLetter: true,
      summaryTitle: "Deadlock Detected — Insufficient ID for CIP Verification",
      steps: [
        {
          title: "Obtain a California state ID through the DMV",
          detail:
            "Without a primary or secondary ID, the client cannot satisfy bank CIP requirements. A state ID card (not a driver's license) is the most direct path — typically requiring a birth certificate or equivalent identity proof.",
        },
        {
          title: "Gather a TIN (SSN or ITIN)",
          detail:
            hasTaxId === "none"
              ? "Federal law requires a TIN before any bank account can be opened. If the client lacks an SSN, apply for an ITIN via IRS Form W-7. Some BankOn-certified programs assist clients through this process."
              : "Once ID is obtained, bring the existing SSN or ITIN — CIP rules mandate TIN collection prior to account opening.",
        },
        {
          title: "Generate a Caseworker Identity Verification Letter",
          detail:
            "This letter can support the DMV state ID application (fee waiver under CA VC §14902 if applicable) and later assist with bank non-documentary CIP verification for address and identity attestation.",
        },
      ],
      citation:
        "31 CFR § 1020.220; USA PATRIOT Act § 326 (Bank Secrecy Act — Customer Identification Program)",
    };
  }

  return {
    deadlock: false,
    needsLetter: false,
    summaryTitle: "Unable to determine pathway",
    steps: [
      {
        title: "Insufficient information",
        detail: "Please answer all questions to generate a pathway.",
      },
    ],
    citation: "",
  };
}

// Core decision tree for the "school" goal — McKinney-Vento enrollment protections.
// Mirrors evaluateShelterPath branching: full docs, partial docs with federal
// protection, one-doc workaround, and deadlock broken by McKinney-Vento.
export function evaluateSchoolPath(answers) {
  const { hasBirthCert, hasProofOfResidency, canVerifyHomelessness } = answers;

  // Case 1: Birth certificate available — standard enrollment path
  if (hasBirthCert === "yes") {
    return {
      deadlock: false,
      needsLetter:
        hasProofOfResidency === "no" && canVerifyHomelessness === "yes",
      summaryTitle: "Standard School Enrollment Path",
      steps: [
        {
          title: "Bring the child's birth certificate to enrollment",
          detail:
            "Schools typically require a birth certificate to verify the child's identity and age. Also bring immunization records if available.",
        },
        {
          title: "Provide proof of residency",
          detail:
            hasProofOfResidency === "yes"
              ? "A current utility bill, lease, or mortgage statement in the parent/guardian's name satisfies typical district residency requirements."
              : "If proof of residency is unavailable, the McKinney-Vento Act prohibits schools from denying enrollment solely due to lack of residency documentation when the family is experiencing homelessness. Contact the district's McKinney-Vento Liaison immediately.",
        },
        {
          title: "Request records transfer from the previous school",
          detail:
            "The enrolling school must request the student's records from their prior school. The student has the right to attend classes while records are pending.",
        },
      ],
      citation:
        hasProofOfResidency === "no"
          ? "McKinney-Vento Homeless Assistance Act, 42 U.S.C. §11432(g)(3)(C)"
          : "California Education Code §48204 — typical district enrollment requirements",
    };
  }

  // Case 2: Lost birth certificate — McKinney-Vento allows immediate enrollment
  if (hasBirthCert === "lost") {
    return {
      deadlock: false,
      needsLetter: canVerifyHomelessness === "yes",
      summaryTitle: "Lost Birth Certificate — Enroll Now Under McKinney-Vento",
      steps: [
        {
          title: "Enroll the child immediately — do not wait for documents",
          detail:
            "Under the McKinney-Vento Act, schools must enroll children experiencing homelessness immediately, even if they cannot produce a birth certificate or other records normally required for enrollment.",
        },
        {
          title: "Request a replacement birth certificate",
          detail:
            "Contact the CA Department of Public Health or the county Vital Records office where the child was born. McKinney-Vento subgrant funds may cover fees associated with obtaining replacement records.",
        },
        {
          title: "Contact the district McKinney-Vento Liaison",
          detail:
            canVerifyHomelessness === "yes"
              ? "Every school district must designate a McKinney-Vento Liaison to assist with enrollment barriers. A caseworker letter (generated below) supports McKinney-Vento eligibility determination and substitute documentation."
              : "Establish a caseworker relationship to document McKinney-Vento eligibility before enrollment if possible — but the school cannot delay enrollment while eligibility is being confirmed.",
        },
      ],
      citation:
        "McKinney-Vento Homeless Assistance Act, 42 U.S.C. §11432(g)(3)(C)",
    };
  }

  // Case 3: No birth certificate, but proof of residency available
  if (hasBirthCert === "no" && hasProofOfResidency === "yes") {
    return {
      deadlock: false,
      needsLetter: canVerifyHomelessness === "yes",
      summaryTitle: "No Birth Certificate — Alternative Age Verification Path",
      steps: [
        {
          title: "Enroll immediately under McKinney-Vento protections",
          detail:
            "Federal law requires immediate enrollment even without a birth certificate. The school must work with the family to obtain acceptable proof of age — medical records, baptismal certificates, or a signed statement of age may substitute.",
        },
        {
          title: "Use proof of residency already on hand",
          detail:
            "The available utility bill or lease satisfies residency verification for standard enrollment. Under McKinney-Vento, schools may not require proof of residency as a condition of enrollment for homeless students.",
        },
        {
          title: "Begin birth certificate request in parallel",
          detail:
            canVerifyHomelessness === "yes"
              ? "Order the birth certificate from Vital Records while the child attends school. A caseworker letter (generated below) may assist with identity verification at Vital Records."
              : "Order the birth certificate from Vital Records while the child attends school. The child will need it for other services beyond enrollment.",
        },
      ],
      citation:
        "McKinney-Vento Homeless Assistance Act, 42 U.S.C. §11432(g)(3)(C); 42 U.S.C. §11432(g)(1)(H)",
    };
  }

  // Case 4: No birth certificate and no proof of residency — core deadlock
  if (hasBirthCert === "no" && hasProofOfResidency === "no") {
    return {
      deadlock: true,
      needsLetter: true,
      summaryTitle:
        "Deadlock Detected — Missing Identity and Residency Documents",
      steps: [
        {
          title: "Enroll immediately — McKinney-Vento overrides the deadlock",
          detail:
            "Schools CANNOT deny enrollment solely because a child lacks a birth certificate or proof of residency when experiencing homelessness. This is the critical deadlock-breaker: enrollment must occur the same or next day.",
        },
        {
          title: "Contact the district McKinney-Vento Liaison",
          detail:
            "The Liaison is legally required to help remove enrollment barriers, obtain records from prior schools, and arrange alternative documentation such as signed statements of age and residency.",
        },
        {
          title: "Generate a Caseworker Identity Verification Letter",
          detail:
            canVerifyHomelessness === "yes"
              ? "This letter supports McKinney-Vento eligibility determination and substitute documentation for both identity and residency. Bring it to enrollment alongside any available records."
              : "Establish a caseworker relationship and generate this letter to support McKinney-Vento eligibility. The school still cannot delay enrollment while documentation is being gathered.",
        },
      ],
      citation:
        "McKinney-Vento Homeless Assistance Act, 42 U.S.C. §11432(g)(3)(C); 42 U.S.C. §11432(g)(1)(H)",
    };
  }

  return {
    deadlock: false,
    needsLetter: false,
    summaryTitle: "Unable to determine pathway",
    steps: [
      {
        title: "Insufficient information",
        detail: "Please answer all questions to generate a pathway.",
      },
    ],
    citation: "",
  };
}


// Core decision tree for the "housing" goal — CA-specific tenant protections.
// Unlike shelter/school, there is no federal mandate forcing a private
// landlord to rent regardless of documentation — the strongest protections
// here are California-specific: source-of-income anti-discrimination and
// a bar on landlords inquiring about immigration status.
export function evaluateHousingPath(answers) {
  const { hasId, hasIncomeProof, hasSsnOrItin } = answers;

  // Case 1: Voucher/subsidy — source-of-income protection applies regardless
  if (hasIncomeProof === "voucher") {
    return {
      deadlock: false,
      needsLetter: hasId === "none",
      summaryTitle: "Housing Choice Voucher — Source-of-Income Protection Applies",
      steps: [
        {
          title: "Cite source-of-income protection if a landlord refuses the voucher",
          detail:
            "California law (Gov. Code §12955, added by SB 329) prohibits landlords from refusing to rent to an applicant because they use a Housing Choice Voucher (Section 8) or other lawful source of income. This is illegal discrimination, not landlord discretion.",
        },
        {
          title:
            hasId === "none"
              ? "Obtain a government ID in parallel"
              : "Bring current ID to the application",
          detail:
            hasId === "none"
              ? "Most landlords and voucher programs still require photo ID for the lease itself. Pursue a state ID at the DMV while the voucher search continues — a caseworker letter (generated below) can support a fee waiver."
              : "Standard or expired ID should be brought to the application; renew an expired ID at the DMV if the landlord requires current identification.",
        },
        {
          title: "Contact the local Public Housing Authority (PHA)",
          detail:
            "The PHA administering the voucher can provide a list of participating landlords and can intervene if source-of-income discrimination is suspected.",
        },
      ],
      citation:
        "California Government Code §12955 (Fair Employment and Housing Act, as amended by SB 329)",
    };
  }

  // Case 2: Full standard path — ID, income proof, and SSN/ITIN all available
  if (
    (hasId === "valid" || hasId === "expired") &&
    hasIncomeProof === "yes" &&
    hasSsnOrItin !== "none"
  ) {
    return {
      deadlock: false,
      needsLetter: false,
      summaryTitle:
        hasId === "valid"
          ? "Standard Rental Application Path"
          : "Expired ID — Renew Before Applying",
      steps: [
        {
          title:
            hasId === "valid"
              ? "Bring current ID and proof of income to the application"
              : "Renew ID at the DMV before applying",
          detail:
            hasId === "valid"
              ? "Most landlords require a government photo ID, recent pay stubs or an offer letter showing income of roughly 2.5–3x monthly rent, and consent to a credit/background check."
              : "Most landlords require current, unexpired photo ID. Renew at the DMV — this typically does not require a fee waiver unless the client is also experiencing homelessness.",
        },
        {
          title: "Provide income documentation",
          detail:
            "Pay stubs, an employer offer letter, or 2–3 months of bank statements typically satisfy income verification requirements.",
        },
        {
          title:
            hasSsnOrItin === "ssn"
              ? "Provide SSN for the credit/background check"
              : "Provide ITIN for the credit/background check",
          detail:
            hasSsnOrItin === "ssn"
              ? "Most landlords use the SSN to run a credit and background check as part of standard tenant screening."
              : "Many landlords and screening services can run a background check using an ITIN in place of an SSN — confirm with the specific property management company or landlord.",
        },
      ],
      citation:
        "Standard landlord tenant-screening practice; California Civil Code §1950.5 (security deposit limits)",
    };
  }

  // Case 3: Cannot/prefers not to provide SSN/ITIN — often immigration-status related
  if (hasId !== "none" && hasSsnOrItin === "none") {
    return {
      deadlock: false,
      needsLetter: true,
      summaryTitle: "No SSN/ITIN Provided — Immigration Status Protections Apply",
      steps: [
        {
          title: "Landlords cannot require disclosure of immigration status",
          detail:
            "California Civil Code §1940.3 prohibits landlords from making inquiries about a tenant's immigration or citizenship status, and voids any lease clause requiring such disclosure. A landlord cannot deny tenancy solely because an applicant declines to provide an SSN for this reason.",
        },
        {
          title: "Offer alternative verification",
          detail:
            "Provide the government ID already on hand and income documentation. Applying for an ITIN via IRS Form W-7 can help for future use — but it is not legally required to rent in California.",
        },
        {
          title: "Generate a Caseworker Identity/Income Verification Letter",
          detail:
            "If a landlord is unfamiliar with these protections or requests additional assurance, this letter can support the application by verifying identity and current circumstances without disclosing immigration status.",
        },
      ],
      citation: "California Civil Code §1940.3",
    };
  }

  // Case 4: No ID, no income proof, no SSN/ITIN — core deadlock
  if (
    hasId === "none" &&
    hasIncomeProof === "no" &&
    hasSsnOrItin === "none"
  ) {
    return {
      deadlock: true,
      needsLetter: true,
      summaryTitle: "Deadlock Detected — No ID, Income Proof, or SSN/ITIN",
      steps: [
        {
          title: "Pursue a guarantor or co-signer",
          detail:
            "Without independent income proof or standard ID, a qualified guarantor or co-signer who meets income/credit requirements can often satisfy a landlord's screening in place of the applicant's own documentation.",
        },
        {
          title: "Look for supportive or transitional housing programs",
          detail:
            "Programs funded through HUD Continuum of Care or local homeless services often place clients directly, bypassing standard private-market screening entirely while other documents are obtained.",
        },
        {
          title: "Obtain a California state ID in parallel",
          detail:
            "Apply for a state ID at the DMV; a caseworker letter (generated below) can support a fee waiver under CA Vehicle Code §14902 if the client is experiencing homelessness.",
        },
        {
          title: "Generate a Caseworker Identity Verification Letter",
          detail:
            "This letter can support both the DMV ID application and give a landlord or guarantor program written assurance of the applicant's identity and circumstances.",
        },
      ],
      citation:
        "HUD Continuum of Care program guidelines; California Vehicle Code §14902",
    };
  }

  return {
    deadlock: false,
    needsLetter: false,
    summaryTitle: "Unable to determine pathway",
    steps: [
      {
        title: "Insufficient information",
        detail: "Please answer all questions to generate a pathway.",
      },
    ],
    citation: "",
  };
}