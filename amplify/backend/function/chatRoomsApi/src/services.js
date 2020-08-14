exports.getActiveChats = (req, res) => {
  res.json([
    {id: '1', name: 'mock chat'},
    {id: '2', name: 'some mock chat 2'},
  ])
};

exports.getDetailedChat = (req, res) => {
  res.json({
    id: '1', name: 'mock chat', members: []
  })
};

exports.createChat = (req, res) => {
  res.status(201).json();
};

exports.deleteChat = (req, res) => {
  res.sendStatus(204);
}