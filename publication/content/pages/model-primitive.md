---
path: /model-primitive/
title: Model Primitive
heading: Stateless predictions, built in
eyebrow: Model Primitive
description: The Model primitive is Tactus's stateless prediction interface for training, inference, and evaluation.
kind: landing
lede: "The Model primitive is for one thing: predictable inference. A Model takes a structured input, returns a structured output, and stays out of your control flow. No conversation state. No tool loops. Just a clean predict() contract that can be trained, versioned, and evaluated over time."
---

### What a Model is (and isn't)

- **Stateless:** each prediction is independent.
- **Schema-first:** inputs and outputs are validated like any other contract.
- **Versioned:** you can register models and choose which version to run.
- **Composable:** combine models with ensembles, A/B routing, or fallbacks.

If you need multi-turn reasoning, tool calls, or adaptive dialogue, that is an [Agent](/agent-primitive/). Models are for repeatable predictions with crisp contracts.

## Declare the model

Models are declared with a runtime backend and a schema. When a model is trainable, training config lives in the same block under `training`.

{{island AnimatedCodeBlock label="Model" filename="model.tac" hint="Model declaration"}}
```tactus
Model "imdb_nb" {
  type = "registry",
  name = "imdb_nb",
  version = "latest",

  input = { text = "string" },
  output = { label = "string", confidence = "float" },

  training = {
    data = {
      source = "hf",
      name = "imdb",
      train = "train",
      test = "test",
      text_field = "text",
      label_field = "label"
    },
    candidates = {
      {
        name = "nb-tfidf",
        trainer = "naive_bayes",
        hyperparameters = {
          alpha = 1.0,
          max_features = 50000,
          ngram_min = 1,
          ngram_max = 2
        }
      }
    }
  }
}
```

## Use it like a function

A Model call returns a typed result and optional metadata. That keeps your procedure predictable and easy to test.

{{island AnimatedCodeBlock label="Usage" filename="procedure.tac" hint="Inference"}}
```tactus
Procedure {
  input = {
    text = field.string{required = true}
  },
  output = {
    decision = field.string{required = true},
    label = field.string{required = true},
    confidence = field.number{required = true}
  },
  function(input)
    local classifier = Model("imdb_nb")
    local result = classifier({text = input.text})
    local out = result.output or result

    if out.confidence < 0.75 then
      return {decision = "review", label = out.label, confidence = out.confidence}
    end

    if out.label == "positive" then
      return {decision = "ship", label = out.label, confidence = out.confidence}
    end

    return {decision = "reject", label = out.label, confidence = out.confidence}
  end
}
```

## Train + evaluate

The CLI selects which model to train by name (handy when a file declares multiple models). Training writes to the registry. Evaluation runs against registered versions and reports metrics.

{{island AnimatedCodeBlock label="CLI" filename="terminal" hint="Training + evaluation"}}
```bash
# Install training extras (keeps core install lightweight)
pip install tactus[ml]

# Train and register artifacts
tactus train file.tac --model imdb_nb

# Evaluate a registered version (default tag: latest)
tactus models evaluate file.tac --model imdb_nb

# Evaluate a specific candidate (tag: candidate/<name>)
tactus models evaluate file.tac --model imdb_nb --candidate nb-tfidf
```

## Test with mocks

Specs should test your logic, not model quality. Use `Mocks` for deterministic, CI-safe tests.

{{island AnimatedCodeBlock label="Mocks" filename="mocks.tac" hint="Deterministic tests"}}
```tactus
Mocks {
  imdb_nb = {
    conditional = {
      {when = {text = "i love this movie"}, returns = {label = "positive", confidence = 0.92}},
      {when = {text = "this was terrible"}, returns = {label = "negative", confidence = 0.88}},
      {when = {text = "meh"}, returns = {label = "positive", confidence = 0.51}}
    }
  }
}
```

### Where Models shine

- Classification, extraction, embeddings, and scoring.
- Stable outputs that power downstream logic.
- Training + evaluation flows you can automate.

If you want the full loop, combine Models with the registry so you can train candidates, evaluate them on held-out data, and promote a winner with confidence.
