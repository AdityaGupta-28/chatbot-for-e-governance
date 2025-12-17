
const schemes = [
    {
        name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
        description: 'An income support scheme for all land-holding farmer families in the country. It provides a financial benefit of Rs. 6,000/- per year in three equal installments.',
        ministry: 'Ministry of Agriculture and Farmers Welfare',
        eligibilityCriteria: [
            'All land-holding farmer families',
            'Husband, Wife, and Minor Children',
            'Exclusions apply for higher income groups and institutional landholders'
        ],
        benefits: [
            'Rs. 6000 per year',
            'Direct Bank Transfer (DBT)',
            'Paid in 3 equal installments of Rs. 2000'
        ],
        link: 'https://pmkisan.gov.in/'
    },
    {
        name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        description: 'A crop insurance scheme that provides comprehensive insurance cover against failure of the crop thus helping in stabilizing the income of the farmers.',
        ministry: 'Ministry of Agriculture and Farmers Welfare',
        eligibilityCriteria: [
            'Farmers including sharecroppers and tenant farmers growing notified crops in notified areas',
            'Voluntary for all farmers'
        ],
        benefits: [
            'Lowest premium rates for farmers',
            'Full sum insured amount coverage',
            'Coverage for post-harvest losses'
        ],
        link: 'https://pmfby.gov.in/'
    },
    {
        name: 'Kisan Credit Card (KCC)',
        description: 'Provides adequate and timely credit support from the banking system under a single window with flexible and simplified procedure to the farmers.',
        ministry: 'Ministry of Finance / Ministry of Agriculture',
        eligibilityCriteria: [
            'All Farmers - individuals / joint borrowers',
            'Tenant farmers, Oral lessees & Share croppers',
            'SHGs or Joint Liability Groups of farmers'
        ],
        benefits: [
            'Credit for cultivation expenses',
            'Investment credit requirements for agriculture',
            'Consumption requirements of farmer household'
        ],
        link: 'https://myscheme.gov.in/schemes/kcc'
    },
    {
        name: 'National Mission for Sustainable Agriculture (NMSA)',
        description: 'Aims at promoting sustainable agriculture through climate change adaptation measures, water efficiency, and soil health management.',
        ministry: 'Ministry of Agriculture',
        eligibilityCriteria: [
            'Farmers in rainfed areas',
            'Small and marginal farmers'
        ],
        benefits: [
            'Soil Health Card',
            'Water use efficiency',
            'Promotion of organic farming'
        ],
        link: 'https://nmsa.dac.gov.in/'
    },
    {
        name: 'Soil Health Card Scheme',
        description: 'Assists farmers in judging the soil health and its periodic maintenance. It advises on the appropriate dosage of nutrients for crop production.',
        ministry: 'Ministry of Agriculture and Farmers Welfare',
        eligibilityCriteria: [
            'All farmers in the country'
        ],
        benefits: [
            'Information on soil nutrient status',
            'Optimal fertilizer usage recommendations',
            'Maintains soil health and fertility'
        ],
        link: 'https://soilhealth.dac.gov.in/'
    }
];

module.exports = schemes;
