import { body, validationResult } from 'express-validator';

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const registerUserRules = () => [
    body('name', 'Name is required').notEmpty().trim().escape(),
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
];

const loginUserRules = () => [
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password is required').notEmpty(),
];

const createPostRules = () => [
    body('content', 'Content is required').notEmpty().trim().isLength({ max: 500 }).escape(),
    body('mood', 'Mood is required')
        .notEmpty()
        .isIn([
            'Inspired',
            'Joyful',
            'Grateful',
            'Romantic',
            'Heartbroken',
            'Lonely',
            'Creative',
            'Motivated',
            'Anxious',
            'Funny',
            'Neutral',
        ]),
    body('contentType', 'Content type is required')
        .notEmpty()
        .isIn(['Quote', 'Life Lesson', 'Story', 'Flirty Line', 'Poem', 'Thought']),
    body('backgroundImage', 'Invalid background image URL').optional({ checkFalsy: true }).isURL(),
    body('backgroundStyle', 'Invalid background style').optional({ checkFalsy: true }).isString(),
];

const addCommentRules = () => [
    body('text', 'Comment text is required').notEmpty().trim().isLength({ max: 280 }).escape(),
];

const chatWithAIRules = () => [
    body('newMessage', 'New message is required').notEmpty().trim().isLength({ max: 1000 }),
    body('history', 'History must be an array').optional().isArray(),
];

const generateInspirationalContentRules = () => [
    body('mood', 'Mood is required')
        .notEmpty()
        .isIn([
            'Inspired',
            'Joyful',
            'Grateful',
            'Romantic',
            'Heartbroken',
            'Lonely',
            'Creative',
            'Motivated',
            'Anxious',
            'Funny',
            'Neutral',
        ]),
    body('contentType', 'Content type is required')
        .notEmpty()
        .isIn(['Quote', 'Life Lesson', 'Story', 'Flirty Line', 'Poem', 'Thought']),
];

export {
    addCommentRules,
    chatWithAIRules,
    createPostRules,
    generateInspirationalContentRules,
    loginUserRules,
    registerUserRules,
    validate,
};
