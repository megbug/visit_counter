import { model, Schema } from 'mongoose';

const countSchema = new Schema({
    name: String,
    count: Number
});

export const Count = model('Count', countSchema);

// name for the site query used 
// count for the number loaded