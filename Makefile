build:
	sam build


deploy: build
	sam package --s3-bucket feedly-cli --output-template-file packaged.yaml
	sam deploy --template-file packaged.yaml --stack-name feedly-cli --capabilities CAPABILITY_IAM
	sam publish --template packaged.yaml
	
test: build
	echo "{}" | sam local invoke --env-vars=./env.json
