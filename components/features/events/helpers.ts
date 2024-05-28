function userFriendlyTime(timeObject: string) {
  let time = JSON.parse(timeObject);

  return `${String(time.hour % 12).padStart(2, '0')}:${String(
    time.minute
  ).padStart(2, '0')} ${time.hour >= 12 ? 'PM' : 'AM'}`;
}

export { userFriendlyTime };
