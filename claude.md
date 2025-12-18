# CRITICAL RULES - MUST FOLLOW
## NO MOCKS, NO TESTS, NO FALLBACKS - EVERYTHING MUST BE REAL
- **NEVER create mock implementations** - Everything should connect to real services
- **NEVER create test endpoints or test data** - All code should be production-ready
- **NEVER use placeholder/sample data** - Use real data or handle errors gracefully
- **NO mock clients** - If a service is unavailable, log the error properly but don't mock it
- **NO test files** - Don't create test_*.py files or any testing code
- **Real implementations only** - Connect to real databases, real APIs, real services
- **NO FALLBACKS** - If a service doesn't work, fix it properly. Don't create workarounds or fallback mechanisms
- **Fix root causes** - When something breaks, fix the actual problem, don't paper over it with fallbacks
- **Update Status** - Update the IMPLEMENTATION-STATUS.md file with the current state of the project.
- **Fix all Build Errors** - Make sure that the app builds successfully with no errors or warnings before stating that work is complete and can be deployed.

## IMPORTANT: FOLLOW ALL DEVELOPMENT GUIDELINES
You are a world-class, full-stack software engineer that specializes in Next.js and who has a preference for clean programming and design patterns, collaborating with a designer on a rapid development project (see below for more details.)

## General Guidelines
### Basic Principles
- Always declare the type of each variable and function (parameters and return value).
  - Avoid using any.
  - Create necessary types.
- Use JSDoc to document public classes and methods.
- Don't leave blank lines within a function.
- One export per file.

### Nomenclature
- Use PascalCase for classes.
- Use camelCase for variables, functions, and methods.
- Use kebab-case for file and directory names.
- Use UPPERCASE for environment variables.
  - Avoid magic numbers and define constants.
- Start each function with a verb.
- Use verbs for boolean variables. Example: isLoading, hasError, canDelete, etc.
- Use complete words instead of abbreviations and correct spelling.
  - Except for standard abbreviations like API, URL, etc.
  - Except for well-known abbreviations:
    - i, j for loops
    - err for errors
    - ctx for contexts
    - req, res, next for middleware function parameters

### Functions
- In this context, what is understood as a function will also apply to a method.
- Write short functions with a single purpose. Less than 20 instructions.
- Name functions with a verb and something else.
  - If it returns a boolean, use isX or hasX, canX, etc.
  - If it doesn't return anything, use executeX or saveX, etc.
- Avoid nesting blocks by:
  - Early checks and returns.
  - Extraction to utility functions.
- Use higher-order functions (map, filter, reduce, etc.) to avoid function nesting.
  - Use arrow functions for simple functions (less than 3 instructions).
  - Use named functions for non-simple functions.
- Avoid using useEffect for UI updates, instead keep derived data in render, with custom hooks/useRef/useMemo. Use effects only for actual side effects.
- Use default parameter values instead of checking for null or undefined.
- Reduce function parameters using RO-RO
  - Use an object to pass multiple parameters.
  - Use an object to return results.
  - Declare necessary types for input arguments and output.
- Use a single level of abstraction.

### Data
- Don't abuse primitive types and encapsulate data in composite types.
- Avoid data validations in functions and use classes with internal validation.
- Prefer immutability for data.
  - Use readonly for data that doesn't change.
  - Use as const for literals that don't change.

### Classes
- Follow SOLID principles.
- Prefer composition over inheritance.
- Declare interfaces to define contracts.
- Write small classes with a single purpose.
  - Less than 200 instructions.
  - Less than 10 public methods.
  - Less than 10 properties.

### Exceptions
- Use exceptions to handle errors you don't expect.
- If you catch an exception, it should be to:
  - Fix an expected problem.
  - Add context.
  - Otherwise, use a global handler.

### Testing
- Follow the Arrange-Act-Assert convention for tests.
- Name test variables clearly.
  - Follow the convention: inputX, mockX, actualX, expectedX, etc.
- Write unit tests for each public function.
  - Use test doubles to simulate dependencies.
    - Except for third-party dependencies that are not expensive to execute.
- Write acceptance tests for each module.
  - Follow the Given-When-Then convention.

### Rules Specific to NestJS
- Use modular architecture
- Encapsulate the API in modules.
  - One module per main domain/route.
  - One controller for its route.
    - And other controllers for secondary routes.
  - A models folder with data types.
    - DTOs validated with class-validator for inputs.
    - Declare simple types for outputs.
  - A services module with business logic and persistence.
    - Entities with MikroORM for data persistence.
    - One service per entity.
- A core module for nest artifacts
  - Global filters for exception handling.
  - Global middlewares for request management.
  - Guards for permission management.
  - Interceptors for request management.
- A shared module for services shared between modules.
  - Utilities
  - Shared business logic

### Testing
- Use the standard Jest framework for testing.
- Write tests for each controller and service.
- Write end to end tests for each api module.
- Add a admin/test method to each controller as a smoke test.

# Project Overview and Specifications
This is an app for managing dockets of cases for mass tort litigation that extracts structured data (fields) from documents based on a case-data ontology (and updates that ontology as needed), and enables attorneys and paralegals to easily summarize key mass tort case attributes (e.g. whether the case meets the inclusion criteria for a tort), both individually and in groups, enables teams to configure cohorts of plaintiffs based on analyzing the case data, and then drafts ready to file documents for each case. 

The system must be built with nextjs, Vercel, Vercel Blob Storage, Neon postgres, and Gemini file and AI APIs, and will be staged and deployed on Vercel. When the time comes for credentials for these services, please store them in a way compatible with Vercel’s environment variables management.

## Key Architecture Concepts
### 1. Data Extraction Layer
- **Purpose**: Extract comprehensive structured data from medical documents using Gemini file API for text extraction and data structure, according to a simple ontology of relationships between parts of a schema of fields, below.
- **Storage**: PostgreSQL for all field data (events, documents, extracted data). 

### 2. Schema
The fields extracted from each set of case documents must include the below, must be extensible to support any other functions of the application, and must be stored in an extensible database schema of fields. Fields prefixed with a @ character should be references to values stored in another part of the schema (e.g. the medical provider associated with a diagnosis must only be a reference to a full record/object for that unique provider in another data store). Fields with a % should be computed based on other fields. Fields with a [] suffix are an array of values. For extracted fields with relations, use Graph-RAG technologies.
* Organization: Name, Address
* Attorney: Name, Title
* Paralegal: Name, Title
* Case: @PlaintiffId, @CaseType, @Organization, @Attorneys[]. Relations: includesPlaintiff → @PlaintiffId, namesDefendant → @DefendantId, involvesProduct → @ProductId, Exposure → @ExposureId.
* Plaintiff: PlaintiffName, @CaseId, birthdate, address, phone, state, zipCode. Relations: hasInjury → Injury, hasExposure → ExposureEvent, treatedBy → Provider, filesClaimIn → Case
* Defendant: Name, Type (corporation, agency, municipality), @ProductIds, StartDate, EndDate. Relations: produced → @Product, isLinkedTo → @ExposureId, isNamedIn → @CaseId
* Diagnosis: Condition, Date, @IcdCode, @Provider, Note, Source, Detected, Complication, %PotentialTreatments[]. Relations: 	isDiagnosisOf → @PlaintiffId, supports → @InjuryId, causedBy → @ExposureId.
* TreatmentsProcedure: Name, Date, @FacilityId, @Provider, @DiagnosisId, Note, Source, @IcdCode, @SnoMedCTCodeLookup, Outcome. Relations: administeredTo → @PlaintiffId, treats → @DiagnosisId, treatedInjury → @InjuryId.
* Medications: Name, Dosage, StartDate, EndDate, @ProviderId, Note, @NDCCode, LotNumber, Duration, %CountOfUse, %Rate, Source
* Symptom: Name, StartDate, EndDate, Type, Detected, Note, Severity, Source
* Injury: Type (physical, psychological, economic), Severity, StartDate, EndDate, Impairments[], Permanent. Relations: hasSymptoms[] → @SymptomId, hasDiagnosis → @DiagnosisId, hasDamages[] → DamagesId, causedBy → @ExposureId.
* ProductOrDevice: Brand, @DefendantId, Platform, Model, StartDate, EndDate, ImplantLocation, @ProviderId, Note, StrengthOrDosage, PackageSize, Source, %Rate
* Exposure: Name, Start date, End date, Location, @MedicationId, @Defendant, Source. Relations: relatedTo → @ProductOrDeviceId, 
* LaboratoryResults: Name, Type, Date, Values, Images[], Note, @FacilityId, @ProviderId, Source
* Provider: FirstName, LastName, NPI, Specialty[], @FacilityId, Note
* Vitals: Name, Type, Date, Values, Note, Source
* ICDCode: Code, Name, Category, Subcategory, %SNOMEDCT
* NDCode: Code, BrandName, ScientificName, Category, Subcategory, Manufacturer, StrengthOrDosage, PackageSize
* Manufacturer: BrandName, Type, CompanyName, Note, Source
* Behaviors: Name, StartDate, EndDate, Type, Note, %Frequency, SymptomIds[], Source
* Content: @ProductDeviceId, @ManufacturerId, Topics[], Type, Note, SymptomIds[], Source

#### CaseType Schema
Each case should have a CaseType, which should be a reference to a CaseTypes table with the following fields:
- CaseName: string identifier
- CaseTypeUUID
- CaseFields: which fields (or all) should be considered for this case, from above.
- CaseEvaluations: a list of associated evaluations (see below). By default should have a reference to the “Complete” evaluation.
- CaseStatus: the state of the case
- CaseCohorts: a list of associated cohort definitions (see below). By default should have a reference to “Qualified” cohort.
- CaseWorkflow: the current step from CaseWorkflowSteps that each caseType has to go through
Each CaseWorkflowStep should have these fields:
- Name (e.g. Intake)
- @CaseTypeId
- @EvaluationId (optional): the evaluation test that cases must pass to have that CaseWorkflowStep.
- @ReportIds[]: the default reports that should be run for a case when it’s created

#### CaseEvaluation schema 
Each set of criteria for evaluating the events of a case (e.g. check that all fields have a value) should have the following fields:
- EvaluationName: string identifier
- EvaluationActive: boolean 
- EvalUUID
- Query: a set of logical conditions constructed with a field value, an operator, and test, e.g. “Case Diagnosis includes D32.0”. These query parts should include:
	- Conditional Logic: equal(x, y) / notEqual(x, y): Tests for equality or inequality between two expressions, greaterThan(x, y) / lessThan(x, y): Tests if the first expression is greater/less than the second, greaterThanOrEqualTo(x, y) / lessThanOrEqualTo(x, y): Tests for greater/less than or equal to, between(x, y, z): Tests if an expression is between two values, like(x, pattern): Tests if a string expression matches a given pattern, in(expression): Creates an In predicate to check if an expression's value is in a collection of values, isNull(x) / isNotNull(x): Tests for null or not null values, isEmpty(collection) / isNotEmpty(collection): Tests if a collection expression is empty or not empty, and(p1, p2, ...) / or(p1, p2, ...): Combines multiple predicates into a single compound predicate, not(predicate): Negates a given predicate. Arithmetic and String Operations: sum(), diff(), prod(), quot(): Methods for addition, subtraction, multiplication, and division, concat(), substring(), length(), lower(), upper(), trim(): String manipulation functions, abs(), sqrt(), mod(): Mathematical functions. Ordering and Grouping: asc(expression) / desc(expression): Specifies ascending or descending order for query results, groupBy(expression): Specifies an expression for grouping results. 
- An Evaluation can have multiple queries, each with an AND or OR relationship to the others. You can add one or more condition groups of multiple conditions, which can have an AND or OR relationship to other conditions and each other. 

For example, an MVA Causation evaluation would require 4 evaluations:
1. MVA Injury Presence Evaluation. Primitives Used: DiagnosisName, DiagnosisDate, IncidentDate, ClinicalFindings, ImagingFindings. Logic: Validates that a diagnosis exists after the incident date AND either clinical findings OR imaging findings are present. Output: InjuryExists (boolean)
2. MVA Causation Evaluation. Primitives Used: IncidentDate, DiagnosisDate, TemporalProximity, ProviderOpinionCausation, BiomechanicalConsistency, PriorSimilarSymptoms. Logic: Implements a scoring system where: +2 points if TemporalProximity ≤ 14 days, +2 points if ProviderOpinionCausation = TRUE, +1 point if BiomechanicalConsistency = TRUE, -2 points if PriorSimilarSymptoms = TRUE. Causation established if score ≥ 2. Output: CausationScore (number), CausationEstablished (boolean)
3. MVA Damages Evaluation. Primitives Used: TreatmentDuration, MedicationPrescribed, WorkRestrictions, MedicalCosts, ADLLimitations, PainDuration. Logic: Damages exist if ANY of these conditions are met: TreatmentDuration ≥ 14 days (2 weeks), WorkRestrictions is not empty, PainDuration ≥ 7 days, MedicalCosts > 0. Output: DamagesExist (boolean)
4. MVA Combined Injury Evaluation. Dependencies: Results from the three previous evaluations. Logic: InjuryFromMVA = TRUE only if ALL three criteria are met: InjuryExists = TRUE, CausationEstablished = TRUE, DamagesExist = TRUE. Output: InjuryFromMVA (boolean), EvaluationMessage (string with detailed feedback).

#### Cohort schema
A cohort is a set of plaintiffs and cases that match a set of criteria. Each cohort should be a set of evaluations that filters the list of all cases with a CaseType to just those that meet all the criteria defined, with these fields:
- CohortName: string identifier
- CohortUUID
- List of Evaluations
- Other filter or sort criteria (e.g. sort by field, filter events after a date)

#### Report schema
A report is an analysis of the events for a case that is generated by ReportPrompts and presented in an order. For example a “Medical Chronology” report contains a list of dates for a case of all events ordered in a timeline by date with the event UUID and event type. Optionally the report can include a limitation to be added only to cases that have a specific cohort. The report has the following fields:
- ReportName
- ReportUUID
- ReportPrompts[]
- @ReportCohortId (optional)
ReportPrompts should have the following fields:
- ReportPromptName
- ReportPromptUUID
- ReportPromptText

#### Document schema
Documents are created with a document containing one or more documentContent items. Each document should use a template (see below) and have these fields:
- DocumentName
- DocumentUUID
- @TemplateId
- @CaseId
- DocumentContents[]
- Date
- Author
- Version
- @PlaintiffId
- @AttorneyId
- @ParalegalId
- Case number
Each DocumentContent item should have the following fields:
- ContentTitle
- @DocumentId
- ContentText (generated, in TipTap format)
- ContentVersion

#### DocumentTemplate
A documentTemplate is created to contain one or more templateSection items, each documentTemplate has the following fields:
- TemplateName
- Version
- Author
Each TemplateSection item has the following fields:
- TemplateSectionName
- TemplateOrderIndex
- Type (boilerplate, conditional, report, or LLM-generated)
- @EvaluationIds[] (optional): the case events should be evaluated with a referenced evaluation and the results should be used in generating the section content
- PromptText
- BoilerPlateText
- @ReportId (optional)

## 3. Event Data Flow
The app should support the following flow for handling files, extracting data, parsing fields, and storing data in fields, calculating computed fields, and looking up the  references between fields. The app should:
1. Allow upload of a group of PDF or DOCX files, and store those files in Vercel blob storage.
2. Create a new record in a Neon Cases table.
2. Create an API request to Gemini FilesAPI to extract the text from the uploaded files and await the response.
3. Create an entry in a Neon database Files table for each uploaded file with a reference to the Blob storage location and a reference to the case.
4. Add the Gemini extracted text from each file to the Files table record.
5. Analyze and extract fields from the above schema, then add an Events table record with an Event json object constructed with the following method:  
	 - Create an event UUID and add to the event object
	 - Add the fields as key/value pairs in appropriate groups to the event object
	 - Look-up or add events for any fields that should be references and add the UUID for that event to the appropriate node in the Event json object (e.g. a Diagnosis event has a @Provider field, lookup among all events to find a matching Provider event by NPI or name, then either add the UUID for that provider’s event, or create a new Provider event and add that UUID to the event).
	 - Calculate any computed fields and add those values (e.g. medication use rate should be calculated by calculating the total duration of time between first exposure event and last duration event, divided by the total number of Exposure events).
	 - For Diagnosis, Procedure, Treatment, and Medication events, use the parsed ICD code or NDC code and a related Clinical Relationship Service (described in a separate CLINICAL_RELATIONSHIP_SERVICE.md document in the project directory) to populate the calculated %PotentialTreatments field for the diagnosis.
6. Run the default report for a caseType (e.g. MedicalChronology) and add that reference to the case record.
7. If the user selects a context (e.g. a specific case, caseType, or caseType and cohort), allow the user to generate and download in PDF or DOCX a selected document (e.g. Plaintiff fact sheet for Depo-Provera eligible cohort).

## 4. App pages
See designs directory for a design of each view. Author the pages as nextjs pages, using the shad-cn design system and a set of common layout components (header, main, footer) and a set of common components for the display of tables, tiles, etc. The navigation should be overview, cohorts, documents, and configuration. The header should also show the current organization, the context (if a caseType or a caseType cohort is selected). The content should follow the below outline:
* Overview
	* Cohorts: all cohorts, plus an “all cases” item (selected by default).
	* CaseWorkflowSteps: a list of all workflowSteps for all caseTypes for the current org, with case count for each.
	* Cases: a paginated table (e.g. 1-20) of all cases for an org, or the cases for the current context (caseType, or caseType plus cohort). Case table should have these columns: caseNumber, Injury, Cohort, WorkflowStep, completeness, and lastUpdated.
* Case detail page: a view of an individual case
	* Case details block, with basic info and case type, and the results of any evaluations run on the case
	* Case Medical History
	* Case status
	* Case AI assistant
* Cohorts Page
	* A list of all cohorts, or the cohorts for the current caseType, indicating the currently selected cohort (if any) and a table of either all cases for an organization or the cases that are part of a cohort.
	* Cohort Editor Page: select or create an evaluation that filters all cases into a cohort
* Documents Page
	* A list of all templates, and UI to generate a new set of documents from a combination of a selected cohort and a selected template.
	* A list of all generated documents for that org (and if selected, caseType and/or cohort)
* Configuration Page
	* Evaluations: a list of all defined evaluations 
		* Evaluation Builder Page
	* CaseType Config: a list of caseTypes associated with an organization (labelled as “Torts”), with the config defined for each.
		* Case Type Editor Page

        