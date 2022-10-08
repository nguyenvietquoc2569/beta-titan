import { EQuestionType, IProblem, IProblemScore, IAnswer } from './problem-question-type'

export function problemToPlaceHolderListWithResult (problem: IProblem): {
  [key: string]: Array<{
    label: string,
    anwser: -1 | 0 | 1,
    type: EQuestionType,
    name: string
  }>
} {
  let re = {}
  for (let pos=0; pos<problem.questions.length ; pos++) {

    let question = problem.questions[pos]
    if (question.type === EQuestionType.OPTION) {
      re[question.name] = ((new Array(question.numberOfOptions)).fill(0).map((id, i) => ({
        label: `${question.name}-placeholder-${i}`.toLowerCase(),
        anwser: question.anwsers.includes(i) ? 1 : 0,
        type: question.type,
        name: question.name
      })))
    }
    if (question.type === EQuestionType.MULTICHOICE) {
      re[question.name] = ((new Array(question.numberOfOptions)).fill(0).map((id, i) => ({
        label: `${question.name}-placeholder-${i}`.toLowerCase(),
        anwser: question.anwsers.includes(i) ? 1 : 0,
        type: question.type,
        name: question.name
      })))
    }
    if (question.type === EQuestionType.DROPBOX) {
      re[question.name] = ([{
        label: (`${question.name}-placeholder-0`.toLowerCase()),
        anwser: -1,
        type: question.type,
        name: question.name
      }])
    }
    if (question.type === EQuestionType.TEXTBOX) {
      re[question.name] = ([{
        label: (`${question.name}-placeholder-0`.toLowerCase()),
        anwser: -1,
        type: question.type,
        name: question.name
      }])
    }
    
  }
  return re
}

export function problemToPlaceHolderList (problem: IProblem) {
  let mapProblemName = problemToPlaceHolderListWithResult (problem)
  return ([].concat(...(Object.values(mapProblemName)))).map(q => q.label)
}

export function makeUpHtmlToPlaceListHolder (makeUpHtml: string): Array<string> {
  let re = []
  try {
    let dom = new DOMParser().parseFromString(`<xml>${makeUpHtml}</xml>`, 'text/html')
    re = Array.from(dom.querySelectorAll('[questionId]')).map(d => d.getAttribute('questionId'))
  } catch (e) {
    re = []
  }
  return re
}

export function makeUpHtmlToHtmlDomNodeList (makeUpHtml: string): Array<Element> {
  let re = []
  try {
    let dom = new DOMParser().parseFromString(`<xml>${makeUpHtml}</xml>`, 'text/html')
    re = Array.from(dom.querySelectorAll('[questionId]'))
  } catch (e) {
    re = []
  }
  return re
}

export const scoreAProblem = (problem: IProblem, answers: IAnswer): IProblemScore => {
  let re: IProblemScore = {
    total: 0
  }

  let phMap = problemToPlaceHolderListWithResult(problem)

  for (let q of problem.questions) {
    re[q.name] = 0
    if (q.type === EQuestionType.TEXTBOX) {
      let ans = answers[q.name] && answers[q.name][0] ? answers[q.name][0].toLowerCase().replace(/\s/g, '').trim(): ''
      let nomalizedAns = q.anwsers.map((value) => value.toLowerCase().trim().replace(/\s/g, ''))
      if (nomalizedAns.includes(ans)) {
        re[q.name] = q.point
      }
    }
    if (q.type === EQuestionType.OPTION) {
      let ans = answers[q.name] && answers[q.name][0] ? answers[q.name][0]: ''
      let phList = phMap[q.name].filter(ph => (ph.label === ans)).map(ph => ph.anwser)
      if (phList.length > 0 && phList[0]===1) {
        re[q.name] = q.point
      }
    }

    if (q.type === EQuestionType.MULTICHOICE) {
      let ans = answers[q.name] ? answers[q.name]: []
      let phListCorect = phMap[q.name].filter(v => (v.anwser === 1)).map(v => v.label)
      let assumeCorrect = true
      for (let s of ans) {
        if (!phListCorect.includes(s)) {
          assumeCorrect = false
        }
      }
      for (let s of phListCorect) {
        if (!ans.includes(s)) {
          assumeCorrect = false
        }
      }
      if (assumeCorrect) {
        re[q.name] = q.point
      }
    }

    if (q.type === EQuestionType.DROPBOX) {
      let ans = answers[q.name] && answers[q.name][0] ? answers[q.name][0].toLowerCase().replace(/\s/g, '') : ''
      let nomalizedAns = q.anwsers.map((value) => value.toLowerCase().replace(/\s/g, ''))
      if (nomalizedAns.includes(ans)) {
        re[q.name] = q.point
      }
    }
  }
  let total = 0
  for (let q of problem.questions) {
    total = total + re[q.name]
  }
  re.total = total
  return re
}

export const problemToCorrectIAnswer = (problem: IProblem): IAnswer => {
  let re: IAnswer = {
  }

  for (let q of problem.questions) {
    re[q.name] = []
  }


  let phMap = problemToPlaceHolderListWithResult(problem)


  for (let q of problem.questions) {
    if (q.type === EQuestionType.TEXTBOX) {
      let ans = q.anwsers.reduce((pre, value, index) => {
        if (index === 0) {
          return pre
        } else {
        return pre + ' / ' + value }
      }, q.anwsers[0] || '')
      re[q.name] = [ans] 
    }
    if (q.type === EQuestionType.OPTION) {
      let phList = phMap[q.name].filter(ph => (ph.anwser === 1)).map(ph => ph.label)
      re[q.name] = [...phList]
    }

    if (q.type === EQuestionType.MULTICHOICE) {
      let phList = phMap[q.name].filter(ph => (ph.anwser === 1)).map(ph => ph.label)
      re[q.name] = [...phList]
    }

    if (q.type === EQuestionType.DROPBOX) {
      let nomalizedAns = q.anwsers.map((value) => value.toLowerCase().replace(/\s/g, ''))
      re[q.name] = [...nomalizedAns]
    }
  }

  return re
}