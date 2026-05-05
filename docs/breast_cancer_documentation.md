# Breast Cancer Classification
**Project Documentation**

**Full project documentation - team contributions, installation guide, architecture, database schema, and member reflection.**

## CONTENTS:
 1. Project Purpose
 2. Delivariables and links
 3. Team and Contributions
 4. Technology Stack
 5. Installation guide
 6. Database Schema
 7. Member Reflections

## Project Purpose ##
**This project presents a machine learning–powered web application designed to classify breast cancer tumors as malignant or benign using clinical diagnostic data. The system is built on the Wisconsin Breast Cancer Diagnostic (WBCD) dataset, which contains features computed from digitized images of fine needle aspirates (FNA) of breast masses.

Early and accurate detection of breast cancer plays a critical role in improving patient survival rates. By leveraging machine learning techniques, this application aims to assist healthcare professionals in making faster and more reliable diagnostic decisions.

The model analyzes various tumor characteristics—such as radius, texture, perimeter, area, and smoothness—to predict the likelihood of malignancy. These predictions are delivered through an intuitive web interface, making the tool accessible and easy to use in a clinical or educational setting.
This system is not intended to replace medical professionals but rather to function as a decision-support tool, helping reduce diagnostic errors and streamline the evaluation process.**

## Goals ##
**Train and compare multiple supervised ML classifiers on the WBCD dataset.
Expose predictions through a RESTful FastAPI backend.
Provide a React-based UI where diagnostic measurements can be entered and results returned in real time.
Persist prediction logs and user sessions in a lightweight SQLite database.
Document the full development process, sprint planning, and time allocation for academic and portfolio use.**

## Scope ##
**In scope: data preprocessing, model training & evaluation, REST API, React UI, SQLite persistence, deployment-ready packaging.
Out of scope: production cloud deployment, real patient data.**


## Deliverables and Links: ##<br>
[Github Repository]: (https://github.com/Sagar746/Breast_Cancer_Classification/tree/dev) <br>
[Google Drive Folder]: (https://drive.google.com/drive/u/2/my-drive) <br>
[Trello Backlog]: (https://trello.com/b/ld37z6tD/breast-cancer-classification-backlog) <br>
[Time Tracking Sheet]: (https://docs.google.com/spreadsheets/d/1s9UnCmOu3g56DopwgZqEDift01xyxhy8xAIFw90iIX8/edit?gid=0#gid=0) <br>
[Project Plans and Docs]: (https://docs.google.com/document/d/16n4F24i_5te_a5b5g8JXHXbEW_S9PwC7tDmXWFjvca0/edit?tab=t.0) <br>

## Team and Contributions ##
   1. Sagar Tiwari / Pawanesh Kumar Bam
     **Project Lead/ML Engineer/ Backend**
      1. Dataset collection and Preprocessing pipeline
      2. Model Training, Tuning and Evaluation
      3. Sprint Planning and Trello Management
      4. FastAPI Rest endpoint design
      5. SQLITE schema design and migrations

   2. Otshal Puri / Baidehi Shah
     **FRONTEND DEVELOPER**
      1. React Component Architecture
      2. Prediction Form and Result Dashboard
      3. API Integration and error handling
      4. Responsive styling and accessibility
      5. Time Tracking Sheet maintenance

## 4. Technology Stack ##
      1. Python :  Core Language backend and ML PipeLine
      2. FastAPI : Asynchronous REST API Framework
      3. React : Component-based frontend UI
      4. SQLITE3 : Embedded relational database
      5. Scikit-Learn : ML models, preprocessing and evaluations
      6. Pandas/Numpy : Data handling and numerical ops
      7. Uvicorn : ASGI server to run FastAPI
      8. SQLALCHEMY : ORM for SQLite operations
      9. Axios : HTTP client for Frontend API calls


