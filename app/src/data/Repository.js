import { parseXmlToJson } from "../utilities/xml";

class Repository {
  fetchCourse = (courseCode) => {
    let courseJson = this.#loadCourse(courseCode);
    let tests = this.#loadCourseContent(courseCode, "tests");
    let labs = this.#loadCourseContent(courseCode, "labs");

    // TODO: this is kinda hacky, but it works for now
    courseJson.tests = tests;
    courseJson.labs = labs;

    return courseJson;
  };

  // TODO: update this method to take a course code and test id
  fetchTest = (testFilePath) => {
    // load the test from the data folder
    let testJson = this.#loadTest(testFilePath);

    // load all the questions listed on the test
    let testJsonQuestions = this.#loadTestQuestions(testJson.questions);

    // TODO: fix this, its kinda dirty
    // replace the questions array with the questions loaded from the data folder
    testJson.questions = testJsonQuestions;

    return testJson;
  };

  // TODO: update this method to take a course code and lab id
  fetchLab = (labFilePath) => {
    return this.#loadLab(labFilePath);
  };

  // private ------------------------------------------------------------

  #loadCourseContent = (courseCode, resource) => {
    let resources = [];
    try {
      fs.readdirSync(`./src/data/${resource}/${courseCode}`).forEach(function (
        file
      ) {
        let data = fs.readFileSync(
          `./src/data/${resource}/${courseCode}/${file}`
        );
        resources.push(JSON.parse(data.toString()));
      });
      return resources;
    } catch (err) {
      console.log(err);
    }
  };

  // loads json test data
  #loadTest = (testFilePath) => {
    // TODO: throw error if the file does not exist
    let data = fs.readFileSync(`./src/data/tests/${testFilePath}.json`);
    return JSON.parse(data.toString());
  };

  // loads xml questions and converts them to json
  #loadTestQuestions = (questionFileNames) => {
    let questions = [];

    for (const file of questionFileNames) {
      // TODO: throw error if the file does not exist
      const xmlQuestion = parseXmlToJson(`questions/${file}`);
      const jsonQuestion = this.#transformXmlQuestionToJson(xmlQuestion);

      questions.push(jsonQuestion);
    }

    return questions;
  };

  // convert an xml question to json
  #transformXmlQuestionToJson = (xmlQuestion) => {
    const questionData = xmlQuestion.question["$"];
    switch (questionData.type) {
      case "MultipleChoice":
        return {
          body: xmlQuestion.question._,
          type: questionData.type,
          factory: questionData.factory,
          options: xmlQuestion.question.option.map((xmlOption) =>
            this.#transformXmlOptionToJson(xmlOption)
          ),
        };
      default:
        throw "ERROR: Unsupported question type.";
    }
  };

  // convert an xml option from a MultipleChoice question to json
  #transformXmlOptionToJson = (xmlOption) => {
    return {
      body: xmlOption._,
      correct: xmlOption["$"].correct === "true",
    };
  };

  // loads json lab data
  #loadLab = (labsFilePath) => {
    // TODO: throw error if the file does not exist
    let data = fs.readFileSync(`./src/data/labs/${labsFilePath}.json`);
    return JSON.parse(data.toString());
  };

  // loads json course data
  #loadCourse = (courseFilePath) => {
    // TODO: throw error if the file does not exist
    let data = fs.readFileSync(`./src/data/courses/${courseFilePath}.json`);
    return JSON.parse(data.toString());
  };
}

export { Repository };
