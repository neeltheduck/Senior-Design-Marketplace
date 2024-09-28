import {Router} from 'express';
import helper from '../helpers.js';
import {checkIsProperString} from '../helpers.js';
const router = Router();
import {addTool,getAllTools,getToolWithID,deleteTool,updateTool, getToolWithUserID,searchTools} from '../data/tools.js';
import {toolRequested, addToWishlist} from '../data/users.js';

router.route('/lenderportalpage')
    .get(async (req, res) => {
        try{
            const toolslists = await getToolWithUserID(req.session.user._id);
            res.render('lenderportalpage', {themePreference: req.session.user.themePreference, title: 'Lender Portal', tools:toolslists});
        }
        catch (error) {
            console.log("lenderportalpage route error");
            console.log(error);
            res.status(500).json({error: error.message})
        }
    });

// router.route('/toolsdelete')
//     .get(async (req, res) => {
//         try{
//             const toolslists = await getTools();
//             res.render('toolsdelete', {themePreference: 'dark', tools:toolslists});
//         }
//         catch (error) {
//             console.log("toolsdelete route error");
//             console.log(error);
//             res.status(500).json({error: error.message})
//         }
//     });

router.route('/toolsdelete/:id')
    .get(async (req, res) => {
        try{
            const tool = await getToolWithID(req.params.id);
            console.log("Tool:");
            console.log(tool);
            res.render('toolsdelete', {themePreference: 'dark', tool: tool});
        }
        catch (error) {
            console.log("toolsdelete route error");
            console.log(error);
            res.status(500).json({error: error.message})
        }
    })
    .post(async (req, res) => {
        try {
            let tool = await deleteTool(req.params.id, req.session.user._id);
            console.log("Tool: output");
            console.log(tool);
            return res.redirect('/lenderportalpage');
            // res.status().json(tool);
            if (true) {
                return res.redirect('/lenderportalpage');
            }
            else{
                console.log("Tool not deleted");
                return res.redirect('/toolsdelete');
            }
            
        } catch (error) {
            console.log("toolsdelete route post error");
            console.log(error);
            res.status(500).json({error: error.message})
        }
    });

router.route('/toolsedit/:id')
    .get(async (req, res) => {
        console.log("inside tooledit route");
        try{
            const tool = await getToolWithID(req.params.id);
            console.log("Tool:");
            console.log(tool);
            let today = new Date();
            today = today.toISOString().split('T')[0];
            res.render('toolsedit', {themePreference: 'dark', tool: tool});
            
        }
        catch (error) {
            console.log("tooledit route error");
            console.log(error);
            res.status(500).json({error: error.message})
        }
    })
    .post(async (req, res) => {
        try {
            console.log("inside tooledit route post");
            console.log(req.body);
            const toolData = {
                _id: req.body._id,
                toolName: req.body.toolName,
                description: req.body.description,
                condition: req.body.condition,
                userID: req.session.user._id,
                dateAdded: req.body.dateAdded,
                availability: req.body.availability,
                location: req.body.autocomplete,
                image: req.body.image
            }
            console.log(toolData);
            const updatetools = await updateTool(toolData);
            console.log("Tool edit : output");
            console.log(updatetools);
            // res.status().json(updatetools);
            if (updatetools.acknowledged) {
                return res.redirect('/lenderportalpage');
            }

        } catch (error) {
            console.log("tooledit route post error");
            console.log(error);
            res.status(500).json({error: error.message})
        }
    });
    
router.route('/toolsregister')
    .get(async (req, res) => {
        try{
            res.render('toolsregister', {themePreference: 'dark', title: 'Tools'});
        }
        catch (error) {
            console.log("toolsregister route get error");
            console.log(error);
            res.status(500).json({error: error.message})
        }
    })
    .post(async (req, res) => {
        try {
            let toolName= req.body.toolName;
            let description= req.body.description;
            let condition= req.body.condition;
            let userID= req.session.user._id;
            let availability={start: new Date(req.body.start_date), end: new Date(req.body.end_date)};
            let location= req.body.autocomplete;
            let image= req.body.image;
            console.log(availability);
            toolName = await helper.checkString(toolName, 'Tool Name');
            description = await helper.checkString(description, 'Description');
            condition = await helper.checkString(condition, 'Condition');
            userID = await helper.checkId(userID, 'User ID');
            availability.start = await helper.checkDate(availability.start, 'Start Date');
            availability.end = await helper.checkDate(availability.end, 'End Date');
            if (availability.start.getTime() > availability.end.getTime()) throw 'Error: Start Date must come before End Date';
            let tool = await addTool(toolName, description, condition, userID, availability, location, image); 
            console.log("Tool: output");
            // console.log(tool);
            // res.status().json(tool);
            if (tool.acknowledged) {
                return res.redirect('/landing');
            }
        } catch (error) {
            console.log("toolsregister route post error");
            console.log(error);
            res.status(500).render('toolsregister',{hasErrors: true, error})
        }
    });

router.route('/tools')
    .get(async (req, res) => {
        try {
            res.render('searchTools', {theme: req.session.user.themePreference});
        } catch (error) {
            console.log("tools route get error");
            console.log(error);
            res.status(500).json({error: error.message});
        }
    })
    .post(async (req, res) => {
        try{
            let search=req.body.search
            let condition=req.body.condition
            search= checkIsProperString(search,"Search")
        let tools=await searchTools(search,condition)
        res.json({success: true, tools: tools, search: search});
        }catch(e){
            res.json({success: false, error: e});
        }
    });

router.route('/tools/:id')
    .get(async (req, res) => {
        try {
            console.log("req");
            //console.log(req);
            req.params.id = await helper.checkId(req.params.id, 'Tool ID');
            const tool = await getToolWithID(req.params.id);
            console.log("Tool:");
            console.log(tool);
            let start = tool.availability.start.toISOString().split('T');
            let end = tool.availability.end.toISOString().split('T');
            res.render('toolbyid', {themePreference: 'dark', tool: tool, start: start[0], end: end[0]});
        } catch (error) {
            console.log("tool route get error");
            console.log(error);
            res.status(500).json({error: error.message});
        }
    })
.post(async (req, res) => {
        if (req.body.form_type === 'tool_request') {
            let req_username = req.body.req_username;
            let lender_id = req.body.lender_id;
            let tool_id = req.body.tool_id;
            let start_date = req.body.start_date;
            let end_date = req.body.end_date;
            try {
                req_username = await helper.checkString(req_username, 'Username');
                lender_id = await helper.checkId(lender_id, 'User ID');
                tool_id = await helper.checkId(tool_id, 'Tool ID');
                start_date = await helper.checkDate(new Date(start_date), 'Start Date');
                end_date = await helper.checkDate(new Date(end_date), 'End Date');
                let result = await toolRequested(lender_id, req_username, tool_id, start_date, end_date, 'pending');
                if (!result) return res.status(500).render('toolbyid', {hasErrors: true, error: 'Error: Could not request tool'});
                const tool = await getToolWithID(tool_id);
                if (!tool) return res.status(500).render('toolbyid', {hasErrors: true, error: "Error: Could not get tool"});
                let start = tool.availability.start.toISOString().split('T');
                let end = tool.availability.end.toISOString().split('T');
                return res.render('toolbyid', {themePreference: req.session.user.themePreference, tool: tool, start: start[0], end: end[0], reqSuccess: true});
            } catch (e) {
                return res.status(500).render('toolbyid', {hasErrors: true, error: e});
            } 
        } else if (req.body.form_type === 'add_wishlist') {
            let toolID = req.body.tool_id;
            let username = req.body.user;
            try {
                toolID = await helper.checkId(toolID, 'Tool ID');
                username = await helper.checkString(username, 'Username');
                let result = await addToWishlist(username, toolID);
                if (!result) return res.status(500).render('toolbyid', {hasErrors: true, error: 'Error: Could not add tool to wish list'});
                const tool = await getToolWithID(toolID);
                if (!tool) return res.status(500).render('toolbyid', {hasErrors: true, error: "Error: Could not get tool"});
                let start = tool.availability.start.toISOString().split('T');
                let end = tool.availability.end.toISOString().split('T');
                return res.render('toolbyid', {tool: tool, start: start[0], end: end[0], wishlistSuccess: true});
            } catch (e) {
                return res.status(500).render('toolbyid', {hasErrors: true, error: e});
            }
        }
    });
    
export default router;
