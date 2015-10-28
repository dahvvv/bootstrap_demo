require 'bundler'
Bundler.require

get '/' do
	erb :index
end

post '/upload' do
	@filename = params[:file][:filename]
	file = params[:file][:tempfile]

	File.open("./public/images/#{@filename}", "wb") do |f|
		f.write(file.read)
	end
end
