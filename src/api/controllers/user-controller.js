//creating the user controllerjs
const userService = require('../services/user-service'); // Assuming your service file is correctly named and located
const asyncHandler = require('express-async-handler'); // For cleaner async error handling

/**
 * @desc    Get all users ( Only admin can access)
 * @route   GET /api/users  ( base path for user routes)
 * @access  Private/Admin (handled by middleware in the route definition)
 */
const getAllUsers = asyncHandler(async (req, res, next) => {
    
    const queryOptions = req.query;

    // 2. Call the Service Function:
    const result = await userService.getAllUsers(queryOptions);
    
    // 3. Send the HTTP response 
    res.status(200).json({
        success: true, // A common flag to indicate the request was successful
        message: 'Users retrieved successfully', 
        count: result.users.length, // The number of users returned in the current page/batch
        pagination: { // Pagination metadata for the client
            currentPage: result.currentPage,
            totalPages: result.totalPages,
            totalUsers: result.totalUsers,
            
        },
        data: result.users, // The array of user objects
    });

    
});


//get user by profile
// const getMyProfile = ()=>{
//     const userId = req.user.id


// }



module.exports ={
    getAllUsers
}
