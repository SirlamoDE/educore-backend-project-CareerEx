const User = require('../models/user-model'); // Import your Mongoose User model

/**
 * Get all users with pagination and optional filtering/sorting.
 * @param {object} queryOptions - Options for pagination, filtering, sorting
 *                                (e.g., { page: '1', limit: '10', role: 'student', sortBy: 'createdAt', sortOrder: 'desc' })
 * @returns {Promise<object>} - An object containing:
 *                              - users: array of user objects (without passwords)
 *                              - currentPage: the current page number
 *                              - totalPages: total number of pages available
 *                              - totalUsers: total number of users matching the filter
 */
const getAllUsers = async (queryOptions = {}) => {
    // 1. Log entry and options: Good for debugging to see what parameters the function received.
    console.log('[USER_SERVICE] getAllUsers called with options:', queryOptions);

    const {
        page = '1',         // Default to page 1 if not provided
        limit = '10',        // Default to 10 users per page if not provided
        role,              // Optional: filter by user role (e.g., 'student', 'instructor')
        sortBy = 'createdAt',// Default sort field (e.g., when the user was created)
        sortOrder = 'desc' // Default sort order (descending, newest first)
    } = queryOptions;

    
    const query = {};
    if (role) { // If a 'role' was provided in queryOptions
        query.role = role; // Add it to the filter (e.g., query will be { role: 'student' })
    }
    

    // 4. Prepare the Sort Criteria:
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1; // e.g., if sortBy='createdAt', sortOrder='desc', then sort is { createdAt: -1 }

    //skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    try {
        const users = await User.find(query)
            .select('-password')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const totalUsers = await User.countDocuments(query);

       
        const totalPages = Math.ceil(totalUsers / parseInt(limit));
        // 9. Log Results: Useful for debugging.
        console.log(`[USER_SERVICE] Found ${users.length} users for page ${page}. Total matching filter: ${totalUsers}`);

        // 10. Return the Structured Result:
        //     - The controller expects a consistent object containing the users and pagination metadata.
        return {
            users,                       // The array of user documents for the current page
            currentPage: parseInt(page), // The current page number
            totalPages,                  // The total number of pages available
            totalUsers,                  // The total number of users that matched the filter criteria
        };
    } catch (error) {
        console.error('[USER_SERVICE] Error in getAllUsers:', error);
        throw new Error('Could not retrieve users due to a server error.');
    }
};


module.exports = {
    getAllUsers,
    // ... other service functions
};