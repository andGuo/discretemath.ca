<script>
  import { onMount, afterUpdate } from "svelte";
  import { mathjaxLoad, mathjaxTypeset } from "../../utilities";
  import { Header, Question } from "./components";
  import Test from "./lib/examinations/Test";
  import "./styles.scss";

  export let data;

  let test = new Test(data.title, data.author, data.questions);

  const updateTest = () => {
    test = test;
  };

  onMount(async () => {
    mathjaxLoad();
  });

  afterUpdate(() => {
    mathjaxTypeset();
  });
</script>

<div class="test-application">
  <Header title={test.title} description={"description"} />
  {#each test.questions as question, questionIndex}
    <Question {question} number={questionIndex + 1} on:update={updateTest} />
  {/each}
</div>
