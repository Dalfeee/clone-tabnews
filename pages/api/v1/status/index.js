function status(request, response) {
  response.status(200).json({ chave: "São zika" });
}

export default status;
