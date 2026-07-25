export const sampleTrial = `trial "Diabetes Care Innovation Study"
description "Evaluating effectiveness of AI-powered glucose monitoring"

include patients where:
  diagnosis is "Type 2 Diabetes"
  age between 40 and 75
  a1c_level > 7.0
  language is "en" or "es"

excludes:
  has_condition is "Severe CKD"

require:
  weekly_glucose_readings for 12 weeks`;
