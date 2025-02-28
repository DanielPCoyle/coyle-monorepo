export const mouseMoveUpdatePeopleOnSite = ({ socket, io, peopleOnSite }) => socket.on("mouseMoveUpdatePeopleOnSite", ({ data, socketId }) => {
  const personIndex = peopleOnSite
    .filter((person) => person.socketId)
    .findIndex((person) => person.socketId === socketId);
  if (personIndex > 0) {
    peopleOnSite[personIndex] = { ...data, socketId };
    io.emit("peopleOnSite", peopleOnSite);
  }
});
