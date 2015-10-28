require 'bundler'
Bundler.require

get '/' do
	erb :index
end

post '/upload' do
	file = params[:file][:tempfile]

	File.open("./public/images/pet", "wb") do |f|
		f.write(file.read)
	end

	redirect to('/')
end
