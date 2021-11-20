require('dotenv').config() 
const express = require("express");
const app = express();
const ejs = require("ejs");
const _ = require("lodash");
const axios = require('axios');
const { google } = require("googleapis");
const path = require("path");
var expressLayouts = require("express-ejs-layouts");

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressLayouts); // connect layouts

// request for home page
app.get("/", function (req, response) {
    var activeProjects = 8;
    var activeMembers = 40;
    var updatesList = []

    // get active data from admin panel
    axios.get(process.env.ACTIVE_DATA)
        .then(function (res) {
            activeProjects = res.data.active_projects;
            activeMembers = res.data.active_members;
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
            axios.get(process.env.QUICK_UPDATES).then(function (res2) {
                updatesList = res2.data;
                response.render("home", { members: activeMembers, projects: activeProjects, title: "", pageTitle: "Metis | IITGn", list: updatesList });
            })
        });
})

// request for admin panel redirect link
app.get("/admin-panel", function(req,res){
    res.redirect(process.env.ADMIN);
});

// request for resources page
app.get('/metis/resources', function (request, response) {

    // get RESOURCES data from admin panel
    axios.get(process.env.RESOURCES).then(res => {
        var resource = res.data;
        response.render("resources", { array: resource, title: "", pageTitle: "Resources | Metis" });
    });
});

// request for single resource page
app.get("/metis/resources/:resource", function (req, response) {
    axios.get(process.env.RESOURCES).then(res => {
        var resourceList = res.data;
        var nameOfResource = _.lowerCase(req.params.resource);
        resourceList.forEach(function (item) {
            var resourceTitle = _.lowerCase(item.Title);
            if (nameOfResource === resourceTitle) {
                resourceTitle = item.Title;
                var resourceContent = item.Content;
                var imp_links = item.Important_Links;
                response.render("oneResource", { title: resourceTitle, pageTitle: " | Resources", content: resourceContent, links: imp_links });
            }
        })
    });
});

// request for projects page
app.get('/metis/projects', function (request, response) {
    // get PROJECTS data from admin panel
    axios.get(process.env.PROJECTS).then(res => {
        var projects = res.data;
        response.render("projects", { title: "", pageTitle: "Projects | Metis", array: projects });
    });
})

// request for single project page
app.get("/metis/projects/:project", function (req, response) {
    axios.get(process.env.PROJECTS).then(res => {
        var projectList = res.data;
        var nameOfProject = _.lowerCase(req.params.project);
        projectList.forEach(function (item) {
            var projectTitle = _.lowerCase(item.Title);
            if (nameOfProject === projectTitle) {
                projectTitle = item.Title;
                var projectContent = item.Content;
                var imp_links = item.Important_Links;
                var github = item.Github_repo;

                response.render("oneProject", { title: projectTitle, pageTitle: " | Projects", content: projectContent, links: imp_links, repo_link: github });
            }
        })
    });
});

// request for events workshops page
app.get('/metis/events_workshops', function (request, response) {
    // get EVENTS data from admin panel
    axios.get(process.env.EVENTS).then(res => {
        var events = res.data;
        response.render("events", { title: "", pageTitle: "Events | Metis", array: events });
    });
})

// request for about page
app.get('/metis/about', function (request, response) {
    response.render("about", { title: "", pageTitle: "About | Metis" });
});

// request for single event page
app.get("/metis/events_workshops/:event", function (req, response) {
    // get EVENTS data from admin panel
    axios.get(process.env.EVENTS).then(res => {
        var eventList = res.data;
        var nameOfEvent = _.lowerCase(req.params.event);
        eventList.forEach(function (item) {
            var eventTitle = _.lowerCase(item.Title);
            if (nameOfEvent === eventTitle) {
                eventTitle = item.Title;
                var eventContent = item.Content;
                var meet_link = item.Meet_link;
                var event_details = item.Date_Time;
                var important_links = item.Important_Links;
                response.render("oneEvent", { title: eventTitle, pageTitle: " | Events | Workshops", content: eventContent, event_link: meet_link, details: event_details, links: important_links });
            }
        })
    });
});

// request for active members page
app.get("/metis/active_members", async (req, res) => {
    // authentication to google 
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: process.env.SCOPES,
    })

    // get clint
    const client = await auth.getClient();

    const spreadsheetId = process.env.SPREADSHEET_ID;

    // connect with google sheet
    const googleSheets = google.sheets({ version: "v4", auth: client })

    // get data from google sheet
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1!A:B",
    })

    // Filter data
    const data = getRows.data.values.slice(1,);

    var dic = {};
    data.forEach(function (d) {
        if (d[1] in dic) {
            dic[d[1]].push(d[0])
        } else {
            dic[d[1]] = [d[0]];
        }
    })

    // arrange data
    var l = [];
    Object.entries(dic).forEach(entry => {
        const [key, value] = entry;
        l.push([key, value])
    });

    l = l.reverse()

    res.render("active_members", { title: "", pageTitle: "Active Members | Metis", dataList: l.slice(0, 10)})
});

// request for error page
app.get("/:id", function (req, res) {
    res.render("Error", { pageTitle: "", title: "Error" });
})

// request for error page
app.get("/:id/:id", function (req, res) {
    res.render("Error", { pageTitle: "", title: "Error" });
})

// request for error page
app.get("/:id/:id/:id", function (req, res) {
    res.render("Error", { pageTitle: "", title: "Error" });
})

// request listening on the port assign if not then 3000
app.listen(process.env.PORT || 3000, function () {
    console.log(`listening at http://localhost:${3000}`);
})


