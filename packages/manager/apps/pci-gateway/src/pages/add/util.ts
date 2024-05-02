const maxRandomNumber = 9999;

function getDate() {
  const date = new Date();
  return `${date.getDate()}${date.getMonth() + 1}`;
}

function getRandomNumber() {
  return (
    (Math.floor(Math.random() * maxRandomNumber) *
      new Date().getMilliseconds()) %
    maxRandomNumber
  );
}

export const getAutoGeneratedName = (prefix = '') => {
  return `${prefix ? `${prefix}-` : ''}${getDate()}-${getRandomNumber()}`;
};
