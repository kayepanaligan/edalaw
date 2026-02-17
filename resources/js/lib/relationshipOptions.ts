/**
 * Eburol relationship categories and types for visitor-to-inmate relationship.
 * Stored value format: "Category Label > Type Label" or "Other: [user text]"
 */

export const RELATIONSHIP_OTHER = 'other';

export type RelationshipCategoryKey =
    | 'immediate_family'
    | 'extended_family'
    | 'intimate_domestic'
    | 'legal_representatives'
    | 'government_official'
    | 'professional_service'
    | 'personal_acquaintances'
    | typeof RELATIONSHIP_OTHER;

export type RelationshipEntry = { value: string; label: string };

export const relationshipCategories: { value: RelationshipCategoryKey; label: string }[] = [
    { value: 'immediate_family', label: 'Immediate Family' },
    { value: 'extended_family', label: 'Extended Family' },
    { value: 'intimate_domestic', label: 'Intimate / Domestic Relationships' },
    { value: 'legal_representatives', label: 'Legal Representatives' },
    { value: 'government_official', label: 'Government / Official Representatives' },
    { value: 'professional_service', label: 'Professional / Service Providers' },
    { value: 'personal_acquaintances', label: 'Personal Acquaintances' },
    { value: RELATIONSHIP_OTHER, label: 'Other' },
];

export const relationshipTypesByCategory: Record<RelationshipCategoryKey, RelationshipEntry[]> = {
    immediate_family: [
        { value: 'Spouse (legal husband/wife)', label: 'Spouse (legal husband/wife)' },
        { value: 'Common-law partner', label: 'Common-law partner' },
        { value: 'Parent (mother/father)', label: 'Parent (mother/father)' },
        { value: 'Child (biological, adopted, stepchild)', label: 'Child (biological, adopted, stepchild)' },
        { value: 'Sibling (brother/sister)', label: 'Sibling (brother/sister)' },
        { value: 'Grandparent', label: 'Grandparent' },
        { value: 'Grandchild', label: 'Grandchild' },
        { value: 'Legal guardian', label: 'Legal guardian' },
    ],
    extended_family: [
        { value: 'Aunt / Uncle', label: 'Aunt / Uncle' },
        { value: 'Cousin', label: 'Cousin' },
        { value: 'Niece / Nephew', label: 'Niece / Nephew' },
        { value: 'In-laws (mother-in-law, brother-in-law, etc.)', label: 'In-laws (mother-in-law, brother-in-law, etc.)' },
        { value: 'Step-relatives', label: 'Step-relatives' },
    ],
    intimate_domestic: [
        { value: 'Fiancé / Fiancée', label: 'Fiancé / Fiancée' },
        { value: 'Boyfriend / Girlfriend', label: 'Boyfriend / Girlfriend' },
        { value: 'Domestic partner', label: 'Domestic partner' },
        { value: 'Former spouse', label: 'Former spouse' },
        { value: 'Former partner', label: 'Former partner' },
    ],
    legal_representatives: [
        { value: 'Private attorney', label: 'Private attorney' },
        { value: 'Public defender', label: 'Public defender' },
        { value: 'Paralegal (authorized by counsel)', label: 'Paralegal (authorized by counsel)' },
        { value: 'Legal aid representative', label: 'Legal aid representative' },
    ],
    government_official: [
        { value: 'Probation or parole officer', label: 'Probation or parole officer' },
        { value: 'Social worker', label: 'Social worker' },
        { value: 'Case manager', label: 'Case manager' },
        { value: 'Consular officer (for foreign nationals)', label: 'Consular officer (for foreign nationals)' },
        { value: 'Human rights representative', label: 'Human rights representative' },
        { value: 'Oversight/inspection official', label: 'Oversight/inspection official' },
    ],
    professional_service: [
        { value: 'Psychologist / Psychiatrist', label: 'Psychologist / Psychiatrist' },
        { value: 'Medical professional', label: 'Medical professional' },
        { value: 'Rehabilitation counselor', label: 'Rehabilitation counselor' },
        { value: 'NGO worker', label: 'NGO worker' },
        { value: 'Education provider', label: 'Education provider' },
    ],
    personal_acquaintances: [
        { value: 'Friend', label: 'Friend' },
        { value: 'Former coworker', label: 'Former coworker' },
        { value: 'Neighbor', label: 'Neighbor' },
        { value: 'Community member', label: 'Community member' },
        { value: 'Sponsor (e.g., reentry support)', label: 'Sponsor (e.g., reentry support)' },
    ],
    [RELATIONSHIP_OTHER]: [],
};

/**
 * Get category key from stored relationship string.
 * Stored: "Immediate Family > Spouse (legal husband/wife)" or "Other: my relationship"
 */
export function parseStoredRelationship(stored: string | null): {
    category: RelationshipCategoryKey;
    typeValue: string;
    otherText: string;
} {
    if (!stored || !stored.trim()) {
        return { category: RELATIONSHIP_OTHER, typeValue: '', otherText: '' };
    }
    const otherPrefix = 'Other: ';
    if (stored.startsWith(otherPrefix)) {
        return {
            category: RELATIONSHIP_OTHER,
            typeValue: RELATIONSHIP_OTHER,
            otherText: stored.slice(otherPrefix.length).trim(),
        };
    }
    const sep = ' > ';
    const i = stored.indexOf(sep);
    if (i === -1) {
        return { category: RELATIONSHIP_OTHER, typeValue: '', otherText: stored.trim() };
    }
    const categoryLabel = stored.slice(0, i).trim();
    const typeLabel = stored.slice(i + sep.length).trim();
    const cat = relationshipCategories.find((c) => c.label === categoryLabel);
    const category = (cat?.value as RelationshipCategoryKey) ?? RELATIONSHIP_OTHER;
    const types = relationshipTypesByCategory[category] ?? [];
    const typeEntry = types.find((t) => t.label === typeLabel || t.value === typeLabel);
    return {
        category,
        typeValue: typeEntry?.value ?? typeLabel,
        otherText: '',
    };
}

/**
 * Build stored relationship string from category, type, and optional other text.
 */
export function buildStoredRelationship(
    category: RelationshipCategoryKey,
    typeValue: string,
    otherText: string
): string {
    if (category === RELATIONSHIP_OTHER) {
        const text = otherText.trim();
        return text ? `Other: ${text}` : '';
    }
    const cat = relationshipCategories.find((c) => c.value === category);
    if (!cat) return '';
    const types = relationshipTypesByCategory[category] ?? [];
    const entry = types.find((t) => t.value === typeValue || t.label === typeValue);
    const typeLabel = entry?.label ?? typeValue;
    return `${cat.label} > ${typeLabel}`;
}
