import { useEffect, useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    relationshipCategories,
    relationshipTypesByCategory,
    RELATIONSHIP_OTHER,
    parseStoredRelationship,
    buildStoredRelationship,
    type RelationshipCategoryKey,
} from '@/lib/relationshipOptions';

type Props = {
    value: string;
    onChange: (stored: string) => void;
    error?: string;
    id?: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
};

export function RelationshipPicker({ value, onChange, error, id = 'relationship', label = 'Relationship to Inmate', required, disabled }: Props) {
    const parsed = useMemo(() => parseStoredRelationship(value || ''), [value]);

    const [category, setCategory] = useState<RelationshipCategoryKey>(parsed.category);
    const [typeValue, setTypeValue] = useState(parsed.typeValue);
    const [otherText, setOtherText] = useState(parsed.otherText);

    useEffect(() => {
        const p = parseStoredRelationship(value || '');
        setCategory(p.category);
        setTypeValue(p.typeValue);
        setOtherText(p.otherText);
    }, [value]);

    const types = category === RELATIONSHIP_OTHER ? [] : (relationshipTypesByCategory[category] ?? []);

    const handleCategoryChange = (val: string) => {
        const key = val as RelationshipCategoryKey;
        setCategory(key);
        if (key === RELATIONSHIP_OTHER) {
            setTypeValue('');
            onChange(otherText.trim() ? `Other: ${otherText.trim()}` : '');
        } else {
            setTypeValue('');
            setOtherText('');
            onChange('');
        }
    };

    const handleTypeChange = (val: string) => {
        setTypeValue(val);
        const cat = relationshipCategories.find((c) => c.value === category);
        if (cat) {
            const entry = relationshipTypesByCategory[category]?.find((t) => t.value === val || t.label === val);
            const typeLabel = entry?.label ?? val;
            onChange(`${cat.label} > ${typeLabel}`);
        }
    };

    const handleOtherTextChange = (text: string) => {
        setOtherText(text);
        onChange(text.trim() ? `Other: ${text.trim()}` : '');
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>
                {label}
                {required && <span className="text-destructive"> *</span>}
            </Label>
            <div className="grid gap-3">
                <Select
                    value={category}
                    onValueChange={handleCategoryChange}
                    disabled={disabled}
                >
                    <SelectTrigger id={id}>
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {relationshipCategories.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                                {c.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {category === RELATIONSHIP_OTHER ? (
                    <Input
                        placeholder="Specify your relationship to the inmate"
                        value={otherText}
                        onChange={(e) => handleOtherTextChange(e.target.value)}
                        disabled={disabled}
                    />
                ) : (
                    types.length > 0 && (
                        <Select
                            value={typeValue}
                            onValueChange={handleTypeChange}
                            disabled={disabled}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select relationship type" />
                            </SelectTrigger>
                            <SelectContent>
                                {types.map((t) => (
                                    <SelectItem key={t.value} value={t.value}>
                                        {t.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )
                )}
            </div>
            <InputError message={error} />
        </div>
    );
}
