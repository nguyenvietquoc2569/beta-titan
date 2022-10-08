import axios from 'axios'

export const checkSomeConditionForCourse = async (condition: string, notId: string) => {
  return new Promise((resolve) => {
    axios({
      method: 'post',
      baseURL: window.location.protocol + '//' + window.location.host,
      url: '/api/v1/edu/courses/findbycondition',
      data: {
        condition,
        notId
      },
    }).then(res => {
      if (res.status === 200) {
        resolve (res.data.result as number)
      }
    })
  })
  
}