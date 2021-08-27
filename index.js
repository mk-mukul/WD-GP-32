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
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressLayouts);

app.get("/", function (req, response) {
    var activeProjects = 8;
    var activeMembers = 40;
    var updatesList = []
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
                // console.log(updatesList);
                response.render("home", { members: activeMembers, projects: activeProjects, title: "", pageTitle: "Metis | IITGn", list: updatesList });
            })
        });
})

app.get("/admin-panel", function(req,res){
    res.redirect(process.env.ADMIN);
});

app.get('/metis/resources', function (request, response) {

    axios.get(process.env.RESOURCES).then(res => {
        var resource = res.data;
        // response.send(resource);
        response.render("resources", { array: resource, title: "", pageTitle: "Resources | Metis" });
        // console.log(res.data);
    });
});

app.get("/metis/resources/:resource", function (req, response) {
    axios.get(process.env.RESOURCES).then(res => {
        var resourceList = res.data;
        var nameOfResource = _.lowerCase(req.params.resource);
        // console.log(nameOfResource);
        resourceList.forEach(function (item) {
            var resourceTitle = _.lowerCase(item.Title);
            // console.log(resourceTitle);
            if (nameOfResource === resourceTitle) {
                // console.log(nameOfResource === resourceTitle);
                resourceTitle = item.Title;
                var resourceContent = item.Content;
                var imp_links = item.Important_Links;
                response.render("oneResource", { title: resourceTitle, pageTitle: " | Resources", content: resourceContent, links: imp_links });
            }
        })
    });
});


app.get('/metis/projects', function (request, response) {
    axios.get(process.env.PROJECTS).then(res => {
        var projects = res.data;
        response.render("projects", { title: "", pageTitle: "Projects | Metis", array: projects });
        // console.log(res.data);
    });
})

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

app.get('/metis/events_workshops', function (request, response) {
    axios.get(process.env.EVENTS).then(res => {
        var events = res.data;
        response.render("events", { title: "", pageTitle: "Events | Metis", array: events });
        // console.log(response.data);
    });
})

app.get('/metis/about', function (request, response) {
    response.render("about", { title: "", pageTitle: "About | Metis" });
});

app.get("/metis/events_workshops/:event", function (req, response) {
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

app.get("/metis/active_members", async (req, res) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: process.env.SCOPES,
    })

    const client = await auth.getClient();

    const spreadsheetId = process.env.SPREADSHEET_ID;

    const googleSheets = google.sheets({ version: "v4", auth: client })

    // getting last updated date
    // const metaData = await googleSheets.spreadsheets.get({
    //     auth,
    //     spreadsheetId,   
    // });

    // var date = metaData.headers.date.substring(5,16);

    // read rows
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1!A:B",
    })

    const data = getRows.data.values.slice(1,);

    var dic = {};
    data.forEach(function (d) {
        if (d[1] in dic) {
            dic[d[1]].push(d[0])
        } else {
            dic[d[1]] = [d[0]];
        }
    })

    var l = [];
    Object.entries(dic).forEach(entry => {
        const [key, value] = entry;
        l.push([key, value])
    });

    l = l.reverse()

    // res.render("active", { dataList: getRows.data.values.slice(0, 15) })
    res.render("active_members", { title: "", pageTitle: "Active Members | Metis", dataList: l.slice(0, 10)})
});

app.get("/:id", function (req, res) {
    res.render("Error", { pageTitle: "", title: "Error" });
})

app.get("/:id/:id", function (req, res) {
    res.render("Error", { pageTitle: "", title: "Error" });
})

app.get("/:id/:id/:id", function (req, res) {
    res.render("Error", { pageTitle: "", title: "Error" });
})

app.listen(process.env.PORT || 3000, function () {
    console.log(`listening at http://localhost:${3000}`);
})


